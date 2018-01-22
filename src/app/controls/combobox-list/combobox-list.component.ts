import { Component, ElementRef, ViewChild, NgZone, AfterViewInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Observable } from 'rxjs/Observable';
import { ISubscription } from 'rxjs/Subscription';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/buffer';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/repeat';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/takeUntil';

import { ComboBoxComponent } from 'app/controls/combobox.component';
import { ComboBoxWrapper } from 'app/wrappers/combobox-wrapper';
import { StyleUtil } from 'app/util/style-util';
import { DomUtil } from 'app/util/dom-util';

@Component({
  selector: 'hc-cmb',
  templateUrl: './combobox-list.component.html',
  styleUrls: ['./combobox-list.component.scss'],
  animations: [
    trigger('listState', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition('void => *', animate('200ms ease-in')),
      transition('* => void', animate('150ms ease-out'))
    ])
  ]
})
export class ComboBoxListComponent extends ComboBoxComponent implements AfterViewInit, AfterViewChecked, OnDestroy {

  @ViewChild('control')
  public control: ElementRef;

  @ViewChild('list')
  public list: ElementRef;

  @ViewChild('scroller')
  public scroller: ElementRef;

  public tabIndex: number;
  public valueStyle: any;

  private checkedListShown: boolean;
  private lastScrolledIndex: number;
  private keyDownSub: ISubscription;
  private inputSub: ISubscription;

  private regEx: RegExp = /([a-z]|\d)/i;

  constructor(zone: NgZone) {
    super(zone);
  }

  public ngAfterViewInit(): void {
    this.regEx.compile();

    const keyDownObs: Observable<any> = Observable.fromEvent(this.control.nativeElement, 'keydown').share();
    const inputIdleObs: Observable<any> = keyDownObs.debounceTime(250).share();

    this.keyDownSub = keyDownObs
      .subscribe(event => this.onKeyDown(event));

    this.inputSub = keyDownObs
      .map(event => event.key)
      .buffer(inputIdleObs)
      .subscribe(events => this.onInput(events));
  }

  public ngAfterViewChecked(): void {
    if (this.listVisible) {
      const selectedListIndex: number = this.getSelectedListIndex();
      if (selectedListIndex !== this.lastScrolledIndex) {
        this.lastScrolledIndex = selectedListIndex;
        this.zone.runOutsideAngular(() => {
          this.scrollSelectedEntryIntoView();
        });
      }

      if (!this.checkedListShown) {
        this.checkedListShown = true;
        this.zone.runOutsideAngular(() => {
          // this.alignList();
        });
      }
    }
  }

  public ngOnDestroy(): void {
    if (this.keyDownSub) {
      this.keyDownSub.unsubscribe();
    }

    if (this.inputSub) {
      this.inputSub.unsubscribe();
    }
  }

  public getSelectedPk(): string {
    if (this.selectedIndex == null || this.selectedIndex < 0) {
      return this.getWrapper().getValue();
    } else {
      return this.entries[this.selectedIndex].getPk();
    }
  }

  public getSelectedValue(): string {
    if (this.selectedIndex == null || this.selectedIndex < 0) {
      return '## ' + this.getWrapper().getValue() + ' ##';
    } else {
      return this.entries[this.selectedIndex].getValue();
    }
  }

  public onContainerMouseDown(event: any): void {
    if (!event.target || !DomUtil.isDescentantOrSelf(this.control.nativeElement, event.target)) {
      event.preventDefault();
    }
  }

  public onControlClick(event: any): void {
    if (this.getWrapper().getIsEditable()) {
      if (this.listVisible) {
        this.hideList();
      } else {
        this.showList();
      }
    }
  }

  public onEnterKey(event: any): void {
    if (this.listVisible) {
      const selectedListIndex: number = this.getSelectedListIndex();
      if (selectedListIndex != null && selectedListIndex >= 0) {
        this.hideList();
        this.setSelectedIndex(selectedListIndex);
        this.callOnSelectionChanged(event);
      }
    }
  }

  protected onKeyDown(event: any): void {
    if (!event || !this.isEditable) {
      return;
    }

    switch (event.which) {
      // Down
      case 40:
        this.selectNext();
        break;

      // Up
      case 38:
        this.selectPrevious();
        break;

      // Enter
      case 13:
        this.onEnterKey(event);
        break;

      // Escape
      case 27:
        this.hideList();
        break;
    }
  }

  protected onInput(chars: Array<string>): void {
    if (!chars || !chars.length || !this.isEditable) {
      return;
    }

    let term: string = String.empty();

    for (const char of chars) {
      if (!char || char.length !== 1 || !this.regEx.test(char)) {
        break;
      }
      term += char;
    }

    if (!String.isNullOrWhiteSpace(term)) {
      this.selectEntryOnTerm(term);
    }
  }

  public onEntryClicked(event: any, index: number): void {
    this.hideList();
    this.setSelectedIndex(index);
    this.callOnSelectionChanged(event);
  }

  public hideList(): void {
    super.hideList();
    this.lastScrolledIndex = null;
    if (this.listVisible) {
      this.checkedListShown = false;
    }
  }

  protected scrollSelectedEntryIntoView(): void {
    if (!this.scroller || !this.list) { return; }
    const selectedLi: HTMLLIElement = this.list.nativeElement.querySelector('li.selected');
    if (selectedLi) {
      DomUtil.scrollIntoView(this.scroller.nativeElement, selectedLi);
    }
  }

  protected selectNext(): void {
    super.selectNext();
    if (!this.listVisible) {
      this.callOnSelectionChanged();
    }
  }

  protected selectPrevious(): void {
    super.selectPrevious();
    if (!this.listVisible) {
      this.callOnSelectionChanged();
    }
  }

  protected selectEntryOnTerm(term: string): void {
    if (String.isNullOrWhiteSpace(term)) {
      return;
    }

    let currentTerm: string = String.empty();
    let latestIndex: number = -1;

    for (const char of term) {
      currentTerm += char;

      const indexForCurrentTerm: number = this.entries.findIndexOnTerm(currentTerm);

      if (indexForCurrentTerm >= 0) {
        latestIndex = indexForCurrentTerm;
      }
    }

    if (latestIndex >= 0) {
      this.setSelectedIndex(latestIndex);
      if (!this.listVisible) {
        this.callOnSelectionChanged();
      }
    }
  }

  protected updateProperties(wrapper: ComboBoxWrapper): void {
    super.updateProperties(wrapper);
    this.tabIndex = (wrapper.getIsEditable() && wrapper.getTabStop()) ? 0 : -1;
  }

  protected updateStyles(wrapper: ComboBoxWrapper): void {
    super.updateStyles(wrapper);
    this.valueStyle = this.createValueStyle(wrapper);
  }

  protected createControlStyle(wrapper: ComboBoxWrapper): any {
    const styles: any = super.createControlStyle(wrapper);
    styles['cursor'] = 'pointer';
    return styles;
  }

  protected createValueStyle(wrapper: ComboBoxWrapper): any {
    const styles: any = {
      'padding': StyleUtil.getFourValue('px',
        wrapper.getPaddingTop(),
        wrapper.getPaddingRight(),
        wrapper.getPaddingBottom(),
        wrapper.getPaddingLeft()),
      'background-color': StyleUtil.getBackgroundColor(wrapper.getIsEditable(), wrapper.getBackColor()),
      'font-weight': StyleUtil.getFontWeight(wrapper.getFontBold()),
      'line-height.px': wrapper.getFontSize(),
      'text-decoration': StyleUtil.getTextDecoration(wrapper.getFontUnderline())
    };

    return styles;
  }
}

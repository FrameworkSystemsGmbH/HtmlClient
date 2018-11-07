import { Component, ElementRef, ViewChild, NgZone, AfterViewInit, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { debounceTime, buffer, map, share } from 'rxjs/operators';

import { ComboBoxDesktopComponent } from 'app/controls/comboboxes/combobox-desktop.component';
import { ComboBoxWrapper } from 'app/wrappers/combobox-wrapper';
import { StyleUtil } from 'app/util/style-util';
import { DomUtil } from 'app/util/dom-util';

@Component({
  selector: 'hc-cmb-list',
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
export class ComboBoxListComponent extends ComboBoxDesktopComponent implements AfterViewInit, OnDestroy {

  @ViewChild('control')
  public control: ElementRef;

  @ViewChild('arrow')
  public arrow: ElementRef;

  @ViewChild('list')
  public list: ElementRef;

  @ViewChild('scroller')
  public scroller: ElementRef;

  public tabIndexAttr: number;
  public valueStyle: any;

  private keyDownSub: Subscription;
  private inputSub: Subscription;

  private regEx: RegExp = /([a-z]|\d)/i;

  constructor(zone: NgZone) {
    super(zone);
  }

  public ngAfterViewInit(): void {
    this.regEx.compile();

    const keyDownObs: Observable<any> = fromEvent(this.control.nativeElement, 'keydown').pipe(share());
    const inputIdleObs: Observable<any> = keyDownObs.pipe(debounceTime(250), share());

    this.keyDownSub = keyDownObs.subscribe(event => this.onKeyDown(event));

    this.inputSub = keyDownObs.pipe(
      map(event => event.key),
      buffer(inputIdleObs)
    ).subscribe(events => this.onInput(events));
  }

  public ngOnDestroy(): void {
    if (this.keyDownSub) {
      this.keyDownSub.unsubscribe();
    }

    if (this.inputSub) {
      this.inputSub.unsubscribe();
    }
  }

  public getControl(): ElementRef {
    return this.control;
  }

  public getArrowWidth(): number {
    return this.arrow ? this.arrow.nativeElement.getBoundingClientRect().width : 0;
  }

  public getSelectedPk(): string {
    const selectedIndex: number = this.getSelectedIndex();
    if (selectedIndex == null || selectedIndex < 0) {
      return this.getWrapper().getValue();
    } else {
      return this.entries[selectedIndex].getPk();
    }
  }

  public getSelectedValue(): string {
    const selectedIndex: number = this.getSelectedIndex();
    if (selectedIndex == null || selectedIndex < 0) {
      return '## ' + this.getWrapper().getValue() + ' ##';
    } else {
      return this.entries[selectedIndex].getValue();
    }
  }

  protected getScroller(): ElementRef {
    return this.scroller;
  }

  protected getList(): ElementRef {
    return this.list;
  }

  public onContainerMouseDown(event: any): void {
    if (!event.target || !DomUtil.isDescentantOrSelf(this.control.nativeElement, event.target)) {
      event.preventDefault();
    }
  }

  public onControlClick(event: any): void {
    if (this.isEditable) {
      if (this.dropDownVisible) {
        this.hideList();
      } else {
        this.showList();
      }
    }
  }

  public onEnterKey(event: any): void {
    if (this.isEditable && this.dropDownVisible) {
      const selectedListIndex: number = this.getSelectedListIndex();
      if (selectedListIndex != null && selectedListIndex >= 0) {
        this.hideList();
        this.setSelectedIndex(selectedListIndex);
        this.callOnSelectionChanged(event);
      }
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
      if (!this.dropDownVisible) {
        this.callOnSelectionChanged();
      }
    }
  }

  protected updateData(wrapper: ComboBoxWrapper): void {
    super.updateData(wrapper);
    this.tabIndexAttr = (wrapper.getCurrentIsEditable() && wrapper.getTabStop()) ? 0 : -1;
    this.setSelectedIndex(this.entries.findIndexOnPk(wrapper.getValue()));
  }

  protected updateStyles(wrapper: ComboBoxWrapper): void {
    super.updateStyles(wrapper);
    this.valueStyle = this.createValueStyle(wrapper);
  }

  protected createValueStyle(wrapper: ComboBoxWrapper): any {
    return {
      'margin': StyleUtil.getFourValue('px',
        wrapper.getPaddingTop(),
        wrapper.getPaddingRight(),
        wrapper.getPaddingBottom(),
        wrapper.getPaddingLeft()),
      'background-color': StyleUtil.getBackgroundColorTextInput(wrapper.getBackColor(), this.isEditable, this.isFocused),
      'font-weight': StyleUtil.getFontWeight(wrapper.getFontBold()),
      'line-height.px': wrapper.getLineHeight(),
      'text-decoration': StyleUtil.getTextDecoration(wrapper.getFontUnderline())
    };
  }
}

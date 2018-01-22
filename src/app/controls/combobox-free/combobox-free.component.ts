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
  templateUrl: './combobox-free.component.html',
  styleUrls: ['./combobox-free.component.scss'],
  animations: [
    trigger('listState', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition('void => *', animate('200ms ease-in')),
      transition('* => void', animate('150ms ease-out'))
    ])
  ]
})
export class ComboBoxFreeComponent extends ComboBoxComponent implements AfterViewInit, AfterViewChecked, OnDestroy {

  @ViewChild('input')
  public input: ElementRef;

  @ViewChild('list')
  public list: ElementRef;

  @ViewChild('scroller')
  public scroller: ElementRef;

  public tabIndexAttr: number;
  public isReadOnlyAttr: boolean;
  public inputStyle: any;
  public arrowStyle: any;

  private inputValue: string;
  private checkedListShown: boolean;
  private lastScrolledIndex: number;
  private keyDownSub: ISubscription;
  private arrowHover: boolean;

  private regEx: RegExp = /([a-z]|\d)/i;

  constructor(zone: NgZone) {
    super(zone);
  }

  public ngAfterViewInit(): void {
    this.regEx.compile();

    this.keyDownSub = Observable
      .fromEvent(this.input.nativeElement, 'keydown')
      .subscribe(event => this.onKeyDown(event));
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
  }

  protected getInputValue(): string {
    return this.inputValue;
  }

  protected setInputValue(value: string): void {
    this.inputValue = value;
  }

  public getSelectedPk(): string {
    return this.getSelectedValue();
  }

  public getSelectedValue(): string {
    if (this.selectedIndex == null || this.selectedIndex < 0) {
      return this.getInputValue();
    } else {
      return this.entries[this.selectedIndex].getValue();
    }
  }

  public onContainerMouseDown(event: any): void {
    if (!event.target || event.target !== this.input.nativeElement) {
      event.preventDefault();
    }
  }

  public onArrowEnter(event: any): void {
    if (this.isEditable) {
      this.arrowHover = true;
    }
  }

  public onArrowLeave(event: any): void {
    if (this.isEditable) {
      this.arrowHover = false;
    }
  }

  public onArrowClick(event: any): void {
    this.setFocus();
    if (this.isEditable) {
      if (this.listVisible) {
        this.hideList();
      } else {
        this.showList();
      }
    }
  }

  public onEnterKey(event: any): void {
    if (this.isEditable && this.listVisible) {
      const selectedListIndex: number = this.getSelectedListIndex();
      if (selectedListIndex != null && selectedListIndex >= 0) {
        this.hideList();
        this.setSelectedIndex(selectedListIndex);
        this.setInputValue(null);
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

  public onInput(event: any): void {
    if (this.isEditable) {
      this.setInputValue(this.input.nativeElement.value);
      this.setSelectedIndex(null);
    }
  }

  public onEntryClicked(event: any, index: number): void {
    this.hideList();
    this.setSelectedIndex(index);
    this.setInputValue(null);
    this.callOnSelectionChanged(event);
  }

  public callOnEnter(event: any): void {
    if (this.getWrapper().hasOnEnterEvent()) {
      this.onEnter.emit(event);
    } else {
      this.onAfterEnter();
    }
  }

  public onAfterEnter(): void {
    if (this.input) {
      setTimeout(() => this.input.nativeElement.select());
    }
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

  public setFocus(): void {
    this.input.nativeElement.focus();
  }

  protected updateWrapper(): void {
    this.getWrapper().setValue(this.getSelectedValue());
  }

  protected updateProperties(wrapper: ComboBoxWrapper): void {
    super.updateProperties(wrapper);
    this.setInputValue(wrapper.getValue());
    this.tabIndexAttr = this.isEditable && wrapper.getTabStop() ? null : -1;
    this.isReadOnlyAttr = Boolean.nullIfFalse(!this.getWrapper().getIsEditable());
  }

  protected updateStyles(wrapper: ComboBoxWrapper): void {
    super.updateStyles(wrapper);
    this.inputStyle = this.createInputStyle(wrapper);
    this.arrowStyle = this.createArrowStyle(wrapper);
  }

  protected createControlStyle(wrapper: ComboBoxWrapper): any {
    const styles: any = super.createControlStyle(wrapper);
    styles['cursor'] = 'pointer';
    return styles;
  }

  protected createInputStyle(wrapper: ComboBoxWrapper): any {
    const styles: any = {
      'border': 'none',
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

  protected createArrowStyle(wrapper: ComboBoxWrapper): any {
    const styles: any = {
      'border-left': '1px solid ' + (this.arrowHover ? wrapper.getBorderColor() : 'transparent')
    };

    return styles;
  }
}

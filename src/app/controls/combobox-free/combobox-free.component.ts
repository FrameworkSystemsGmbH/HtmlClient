import { Component, ElementRef, ViewChild, NgZone, AfterViewInit, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Observable } from 'rxjs/Observable';
import { ISubscription } from 'rxjs/Subscription';

import { ComboBoxDesktopComponent } from 'app/controls/combobox-desktop.component';
import { ComboBoxWrapper } from 'app/wrappers/combobox-wrapper';
import { StyleUtil } from 'app/util/style-util';
import { DomUtil } from 'app/util/dom-util';

@Component({
  selector: 'hc-cmb-free',
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
export class ComboBoxFreeComponent extends ComboBoxDesktopComponent implements AfterViewInit, OnDestroy {

  @ViewChild('input')
  public input: ElementRef;

  @ViewChild('arrow')
  public arrow: ElementRef;

  @ViewChild('list')
  public list: ElementRef;

  @ViewChild('scroller')
  public scroller: ElementRef;

  public tabIndexAttr: number;
  public isReadOnlyAttr: boolean;
  public inputStyle: any;
  public arrowStyle: any;

  private inputValue: string;
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

  public getArrowWidth(): number {
    return this.arrow ? this.arrow.nativeElement.getBoundingClientRect().width : 0;
  }

  public getSelectedPk(): string {
    return this.getSelectedValue();
  }

  public getSelectedValue(): string {
    const selectedIndex: number = this.getSelectedIndex();
    if (selectedIndex == null || selectedIndex < 0) {
      return this.getInputValue();
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
        this.setInputValue(null);
        this.callOnSelectionChanged(event);
      }
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
      setTimeout(() => DomUtil.setSelection(this.input.nativeElement));
    }
  }

  protected setFocus(): void {
    if (this.input) {
      this.input.nativeElement.focus();
    }
  }

  protected updateWrapper(): void {
    this.getWrapper().setValue(this.getSelectedValue());
  }

  protected updateData(wrapper: ComboBoxWrapper): void {
    super.updateData(wrapper);
    this.tabIndexAttr = this.isEditable && wrapper.getTabStop() ? null : -1;
    this.isReadOnlyAttr = Boolean.nullIfFalse(!this.isEditable);
    this.setInputValue(wrapper.getValue());
    this.setSelectedIndex(this.entries.findIndexOnValue(wrapper.getValue()));
  }

  protected updateStyles(wrapper: ComboBoxWrapper): void {
    super.updateStyles(wrapper);
    this.inputStyle = this.createInputStyle(wrapper);
    this.arrowStyle = this.createArrowStyle(wrapper);
  }

  protected createInputStyle(wrapper: ComboBoxWrapper): any {
    return {
      'border': 'none',
      'padding': StyleUtil.getFourValue('px',
        wrapper.getPaddingTop(),
        wrapper.getPaddingRight(),
        wrapper.getPaddingBottom(),
        wrapper.getPaddingLeft()),
      'background-color': StyleUtil.getBackgroundColor(this.isEditable, wrapper.getBackColor()),
      'font-weight': StyleUtil.getFontWeight(wrapper.getFontBold()),
      'line-height.px': wrapper.getLineHeight(),
      'text-decoration': StyleUtil.getTextDecoration(wrapper.getFontUnderline())
    };
  }

  protected createArrowStyle(wrapper: ComboBoxWrapper): any {
    return {
      'border-left': '1px solid ' + (this.arrowHover ? wrapper.getBorderColor() : 'transparent')
    };
  }
}

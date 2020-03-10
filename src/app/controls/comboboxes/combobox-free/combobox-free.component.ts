import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, Injector } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Subscription, fromEvent } from 'rxjs';

import { ComboBoxDesktopComponent } from 'app/controls/comboboxes/combobox-desktop.component';
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

  @ViewChild('input', { static: true })
  public input: ElementRef;

  @ViewChild('arrow', { static: true })
  public arrow: ElementRef;

  @ViewChild('list', { static: true })
  public list: ElementRef;

  @ViewChild('scroller', { static: true })
  public scroller: ElementRef;

  public tabIndexAttr: number;
  public isReadOnlyAttr: boolean;
  public inputStyle: any;
  public arrowStyle: any;

  private inputValue: string;
  private keyDownSub: Subscription;
  private arrowHover: boolean;

  private regEx: RegExp = /([a-z]|\d)/i;

  constructor(injector: Injector) {
    super(injector);
  }

  public ngAfterViewInit(): void {
    this.regEx.compile();

    this.keyDownSub = fromEvent<KeyboardEvent>(this.input.nativeElement, 'keydown').subscribe(event => this.onKeyDown(event));
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

  public getControl(): ElementRef {
    return this.input;
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

  public onArrowEnter(): void {
    if (this.isEditable) {
      this.arrowHover = true;
    }
  }

  public onArrowLeave(): void {
    if (this.isEditable) {
      this.arrowHover = false;
    }
  }

  public onArrowClick(): void {
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

  public onInput(): void {
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
      'padding': StyleUtil.pixToRemFourValueStr(
        wrapper.getPaddingTop(),
        wrapper.getPaddingRight(),
        wrapper.getPaddingBottom(),
        wrapper.getPaddingLeft()),
      'background-color': StyleUtil.getBackgroundColorTextInput(wrapper.getBackColor(), this.isEditable, this.isOutlineVisible()),
      'font-weight': StyleUtil.getFontWeight(wrapper.getFontBold()),
      'line-height.rem': StyleUtil.pixToRem(wrapper.getLineHeight()),
      'text-decoration': StyleUtil.getTextDecoration(wrapper.getFontUnderline())
    };
  }

  protected createArrowStyle(wrapper: ComboBoxWrapper): any {
    return {
      'border-left': '0.1rem solid ' + (this.arrowHover ? wrapper.getBorderColor() : 'transparent')
    };
  }
}

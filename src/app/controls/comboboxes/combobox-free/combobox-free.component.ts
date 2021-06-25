import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ComboBoxDesktopComponent } from '@app/controls/comboboxes/combobox-desktop.component';
import * as DomUtil from '@app/util/dom-util';
import * as StyleUtil from '@app/util/style-util';
import { ComboBoxWrapper } from '@app/wrappers/combobox-wrapper';
import { faCaretDown, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { fromEvent, Subscription } from 'rxjs';

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

  public iconCaretDown: IconDefinition = faCaretDown;

  public tabIndexAttr: number;
  public isReadOnlyAttr: boolean;
  public inputStyle: any;
  public arrowStyle: any;

  private inputValue: string;
  private keyDownSub: Subscription;
  private arrowHover: boolean;

  private readonly regEx: RegExp = /([a-z]|\d)/i;

  public ngAfterViewInit(): void {
    this.regEx.compile();

    this.keyDownSub = fromEvent<KeyboardEvent>(this.input.nativeElement, 'keydown').subscribe(event => this.onKeyDown(event));
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();

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
    return this.arrow ? this.arrow.nativeElement.getBoundingClientRect().width as number : 0;
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
    this.getFocusElement().focus();
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
        this.callSelectionChanged(event);
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
    this.callSelectionChanged(event);
  }

  public callCtrlEnter(event: any): void {
    if (this.getWrapper().hasOnEnterEvent()) {
      this.ctrlEnter.emit(event);
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
      'background-color': StyleUtil.getBackgroundColorTextInput(wrapper.getBackColor(), this.isEditable, this.isOutlined),
      'font-weight': StyleUtil.getFontWeight(wrapper.getFontBold()),
      'line-height.rem': StyleUtil.pixToRem(wrapper.getLineHeight()),
      'text-decoration': StyleUtil.getTextDecoration(wrapper.getFontUnderline())
    };
  }

  protected createArrowStyle(wrapper: ComboBoxWrapper): any {
    return {
      'border-left': `0.1rem solid ${this.arrowHover ? wrapper.getBorderColor() : 'transparent'}`
    };
  }
}

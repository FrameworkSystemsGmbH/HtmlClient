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
  public input: ElementRef<HTMLInputElement> | null = null;

  @ViewChild('arrow', { static: true })
  public arrow: ElementRef<HTMLDivElement> | null = null;

  @ViewChild('list', { static: true })
  public list: ElementRef<HTMLUListElement> | null = null;

  @ViewChild('scroller', { static: true })
  public scroller: ElementRef<HTMLDivElement> | null = null;

  public iconCaretDown: IconDefinition = faCaretDown;

  public tabIndexAttr: number | null = null;
  public isReadOnlyAttr: boolean | null = null;
  public inputStyle: any;
  public arrowStyle: any;

  private _inputValue: string | null = null;
  private _keyDownSub: Subscription | null = null;
  private _arrowHover: boolean = false;

  private readonly _regEx: RegExp = /([a-z]|\d)/i;

  public ngAfterViewInit(): void {
    if (this.input != null) {
      this._keyDownSub = fromEvent<KeyboardEvent>(this.input.nativeElement, 'keydown').subscribe(event => this.onKeyDown(event));
    }
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();

    if (this._keyDownSub) {
      this._keyDownSub.unsubscribe();
    }
  }

  protected getInputValue(): string | null {
    return this._inputValue;
  }

  protected setInputValue(value: string | null): void {
    this._inputValue = value;
  }

  public getControl(): ElementRef<HTMLDivElement> | null {
    return this.input;
  }

  public getArrowWidth(): number {
    return this.arrow ? this.arrow.nativeElement.getBoundingClientRect().width : 0;
  }

  public getSelectedPk(): string | null {
    return this.getSelectedValue();
  }

  public getSelectedValue(): string | null {
    const inputValue: string | null = this.getInputValue();

    if (inputValue != null && inputValue.length > 0) {
      return inputValue;
    }

    const selectedIndex: number | null = this.getSelectedIndex();

    if (selectedIndex != null && selectedIndex >= 0 && this.entries != null && selectedIndex < this.entries.length && !this.entries[selectedIndex].isNullEntry()) {
      return this.entries[selectedIndex].getValue();
    }

    return null;
  }

  public getPlaceholderShown(): boolean {
    const captionAsPlaceholder: boolean | null = this.getWrapper().getCaptionAsPlaceholder();

    if (!captionAsPlaceholder) {
      return false;
    }

    const inputValue: string | null = this.getInputValue();

    if (inputValue != null && inputValue.length > 0) {
      return false;
    }

    const selectedIndex: number | null = this.getSelectedIndex();

    if (selectedIndex != null && selectedIndex >= 0 && this.entries != null && selectedIndex < this.entries.length && !this.entries[selectedIndex].isNullEntry()) {
      return false;
    }

    return true;
  }

  protected getScroller(): ElementRef<HTMLDivElement> | null {
    return this.scroller;
  }

  protected getList(): ElementRef<HTMLUListElement> | null {
    return this.list;
  }

  public onContainerMouseDown(event: any): void {
    if (this.input != null && (!event.target || event.target !== this.input.nativeElement)) {
      event.preventDefault();
    }
  }

  public onArrowEnter(): void {
    if (this.isEditable) {
      this._arrowHover = true;
    }
  }

  public onArrowLeave(): void {
    if (this.isEditable) {
      this._arrowHover = false;
    }
  }

  public onArrowClick(): void {
    const focusElement: HTMLElement | null = this.getFocusElement();
    if (focusElement != null) {
      focusElement.focus();
      if (this.isEditable) {
        if (this.dropDownVisible) {
          this.hideList();
        } else {
          this.showList();
        }
      }
    }
  }

  public onEnterKey(): void {
    if (this.isEditable && this.dropDownVisible) {
      const selectedListIndex: number | null = this.getSelectedListIndex();
      if (selectedListIndex != null && selectedListIndex >= 0) {
        this.hideList();
        this.setSelectedIndex(selectedListIndex);
        this.setInputValue(null);
        this.callSelectionChanged();
      }
    }
  }

  public onInput(): void {
    if (this.isEditable && this.input != null) {
      this.setInputValue(this.input.nativeElement.value);
      this.setSelectedIndex(null);
    }
  }

  public onEntryClicked(index: number): void {
    this.hideList();
    this.setSelectedIndex(index);
    this.setInputValue(null);
    this.callSelectionChanged();
  }

  public callCtrlEnter(event: any): void {
    if (this.getWrapper().hasOnEnterEvent()) {
      this.ctrlEnter.emit(event);
    } else {
      this.onAfterEnter();
    }
  }

  public onAfterEnter(): void {
    if (this.input != null) {
      setTimeout(() => {
        if (this.input != null) {
          DomUtil.setSelection(this.input.nativeElement);
        }
      });
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
    const wrpValue: string | null = wrapper.getValue();
    this.setSelectedIndex(this.entries != null && this.entries.length > 0 && wrpValue != null ? this.entries.findIndexOnValue(wrpValue) : null);
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
      'border-left': `0.1rem solid ${this._arrowHover ? wrapper.getBorderColor() : 'transparent'}`
    };
  }
}

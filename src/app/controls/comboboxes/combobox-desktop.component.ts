import { ElementRef, AfterViewChecked, NgZone, Directive } from '@angular/core';

import { ILayoutableProperties } from '@app/layout/layoutable-properties.interface';

import { ComboBoxComponent } from '@app/controls/comboboxes/combobox.component';
import { ComboBoxWrapper } from '@app/wrappers/combobox-wrapper';

import * as DomUtil from '@app/util/dom-util';
import * as KeyUtil from '@app/util/key-util';
import * as StyleUtil from '@app/util/style-util';

@Directive()
export abstract class ComboBoxDesktopComponent extends ComboBoxComponent implements AfterViewChecked {

  public selectedListIndex: number;
  public dropDownVisible: boolean;

  public containerStyle: any;
  public controlStyle: any;
  public dropDownStyle: any;
  public dropDownScrollerStyle: any;

  protected zone: NgZone;

  private lastScrolledIndex: number;

  protected init(): void {
    super.init();
    this.zone = this.getInjector().get(NgZone);
  }

  protected abstract getScroller(): ElementRef;

  protected abstract getList(): ElementRef;

  public ngAfterViewChecked(): void {
    if (this.dropDownVisible) {
      const selectedListIndex: number = this.getSelectedListIndex();
      if (selectedListIndex !== this.lastScrolledIndex) {
        this.lastScrolledIndex = selectedListIndex;
        this.zone.runOutsideAngular(() => {
          this.scrollSelectedEntryIntoView();
        });
      }
    }
  }

  protected setSelectedIndex(index: number): void {
    super.setSelectedIndex(index);
    this.setSelectedListIndex(null);
  }

  public getSelectedListIndex(): number {
    const selectedIndex: number = this.getSelectedIndex();
    return this.selectedListIndex != null ? this.selectedListIndex : (selectedIndex != null ? selectedIndex : -1);
  }

  protected setSelectedListIndex(index: number): void {
    this.selectedListIndex = index;
  }

  public abstract onEnterKey(event: KeyboardEvent): void;

  protected onKeyDown(event: KeyboardEvent): void {
    if (!event || !this.isEditable) {
      return;
    }

    switch (KeyUtil.getKeyString(event)) {
      // Down
      case 'ArrowDown':
        this.selectNext();
        break;

      // Up
      case 'ArrowUp':
        this.selectPrevious();
        break;

      // Tab
      case 'Tab':
        this.onFocusKey(event, this.dropDownVisible);
        break;

      // Enter
      case 'Enter':
        const open: boolean = this.dropDownVisible;
        this.onEnterKey(event);
        this.onFocusKey(event, open);
        break;

      // Escape
      case 'Escape':
        this.hideList();
        break;
    }
  }

  protected onFocusKey(event: KeyboardEvent, open: boolean): void {
    this.getFocusService().setLastKeyEvent(event);

    if ((KeyUtil.getKeyString(event) === 'Tab' || KeyUtil.getKeyString(event) === 'Enter') && !open) {
      this.hideList();

      if (event.shiftKey) {
        this.getWrapper().focusKeyboardPrevious();
      } else {
        this.getWrapper().focusKeyboardNext();
      }

      event.preventDefault();
    }
  }

  public callCtrlLeave(event: any): void {
    this.hideList();
    super.callCtrlLeave(event);
  }

  protected scrollSelectedEntryIntoView(): void {
    const scroller: ElementRef = this.getScroller();
    const list: ElementRef = this.getList();

    if (!scroller || !list) { return; }
    const selectedLi: HTMLLIElement = list.nativeElement.querySelector('li.selected');
    if (selectedLi) {
      DomUtil.scrollIntoView(scroller.nativeElement, selectedLi);
    }
  }

  protected selectNext(): void {
    if (!this.entries || !this.entries.length) {
      return;
    }

    if (this.dropDownVisible) {
      const currentListIndex: number = this.getSelectedListIndex();
      this.setSelectedListIndex(currentListIndex != null ? Math.min(currentListIndex + 1, this.entries.length - 1) : 0);
    } else {
      this.showList();
    }
  }

  protected selectPrevious(): void {
    if (this.dropDownVisible) {
      const currentListIndex: number = this.getSelectedListIndex();
      this.setSelectedListIndex(currentListIndex != null ? Math.max(currentListIndex - 1, 0) : 0);
    } else {
      this.showList();
    }
  }

  public showList(): void {
    this.dropDownVisible = true;
  }

  public hideList(): void {
    this.dropDownVisible = false;
    this.lastScrolledIndex = null;
    this.setSelectedListIndex(null);
  }

  protected updateStyles(wrapper: ComboBoxWrapper): void {
    super.updateStyles(wrapper);
    this.containerStyle = this.createContainerStyle(wrapper);
    this.controlStyle = this.createControlStyle(wrapper);
    this.dropDownStyle = this.createDropDownStyle(wrapper);
    this.dropDownScrollerStyle = this.createDropDownScrollerStyle(wrapper);
  }

  protected createContainerStyle(wrapper: ComboBoxWrapper): any {
    const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();
    const layoutWidth: number = layoutableProperties.getClientWidth();
    const layoutHeight: number = layoutableProperties.getClientHeight();
    const isSizeVisible: boolean = layoutWidth > 0 && layoutHeight > 0;

    return {
      'display': this.isVisible && isSizeVisible ? null : 'none',
      'left.rem': StyleUtil.pixToRem(layoutableProperties.getX()),
      'top.rem': StyleUtil.pixToRem(layoutableProperties.getY()),
      'font-family': wrapper.getFontFamily(),
      'font-style': StyleUtil.getFontStyle(wrapper.getFontItalic()),
      'font-size.rem': StyleUtil.pixToRem(wrapper.getFontSize())
    };
  }

  protected createControlStyle(wrapper: ComboBoxWrapper): any {
    const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();

    return {
      'min-width.rem': 0,
      'min-height.rem': 0,
      'width.rem': StyleUtil.pixToRem(layoutableProperties.getClientWidth()),
      'height.rem': StyleUtil.pixToRem(layoutableProperties.getClientHeight()),
      'color': StyleUtil.getForeColor(this.isEditable, wrapper.getForeColor()),
      'background-color': StyleUtil.getBackgroundColorTextInput(wrapper.getBackColor(), this.isEditable, this.isOutlined),
      'border-style': 'solid',
      'border-color': wrapper.getBorderColor(),
      'border-radius': StyleUtil.pixToRemFourValueStr(
        wrapper.getBorderRadiusTopLeft(),
        wrapper.getBorderRadiusTopRight(),
        wrapper.getBorderRadiusBottomRight(),
        wrapper.getBorderRadiusBottomLeft()),
      'border-width': StyleUtil.pixToRemFourValueStr(
        wrapper.getBorderThicknessTop(),
        wrapper.getBorderThicknessRight(),
        wrapper.getBorderThicknessBottom(),
        wrapper.getBorderThicknessLeft()),
      'margin': StyleUtil.pixToRemFourValueStr(
        wrapper.getMarginTop(),
        wrapper.getMarginRight(),
        wrapper.getMarginBottom(),
        wrapper.getMarginLeft()),
      'cursor': !this.isEditable ? 'not-allowed' : 'pointer'
    };
  }

  protected createValueStyle(wrapper: ComboBoxWrapper): any {
    const styles: any = {
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

    return styles;
  }

  protected createDropDownStyle(wrapper: ComboBoxWrapper): any {
    const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();

    return {
      'top.rem': StyleUtil.pixToRem(layoutableProperties.getClientHeight() + wrapper.getMarginTop()),
      'left.rem': StyleUtil.pixToRem(wrapper.getMarginLeft()),
      'min-width.rem': StyleUtil.pixToRem(layoutableProperties.getClientWidth()),
      'border': '0.1rem solid ' + wrapper.getBorderColor(),
      'border-radius': StyleUtil.pixToRemFourValueStr(
        wrapper.getBorderRadiusBottomLeft(),
        wrapper.getBorderRadiusBottomRight(),
        wrapper.getBorderRadiusTopRight(),
        wrapper.getBorderRadiusTopLeft())
    };
  }

  protected createDropDownScrollerStyle(wrapper: ComboBoxWrapper): any {
    const maxWidth: number = wrapper.getMaxDropDownWidth();
    const maxHeight: number = wrapper.getMaxDropDownHeight();

    return {
      'max-width.rem': maxWidth > 0 ? StyleUtil.pixToRem(maxWidth) : null,
      'max-height.rem': maxHeight > 0 ? StyleUtil.pixToRem(maxHeight) : null
    };
  }
}

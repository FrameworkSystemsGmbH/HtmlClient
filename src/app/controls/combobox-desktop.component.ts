import { ElementRef, OnInit, DoCheck, AfterViewChecked, NgZone } from '@angular/core';

import { ILayoutableProperties } from 'app/layout/layoutable-properties.interface';

import { ComboBoxComponent } from 'app/controls/combobox.component';
import { ComboBoxWrapper } from 'app/wrappers/combobox-wrapper';
import { StyleUtil } from 'app/util/style-util';
import { DomUtil } from 'app/util/dom-util';

export abstract class ComboBoxDesktopComponent extends ComboBoxComponent implements OnInit, DoCheck, AfterViewChecked {

  public selectedListIndex: number;
  public dropDownVisible: boolean;

  public containerStyle: any;
  public controlStyle: any;
  public dropDownStyle: any;
  public dropDownScrollerStyle: any;

  private lastScrolledIndex: number;

  constructor(protected zone: NgZone) {
    super();
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

  protected setSelectedIndex(index: number) {
    super.setSelectedIndex(index);
    this.setSelectedListIndex(null);
  }

  protected getSelectedListIndex(): number {
    const selectedIndex: number = this.getSelectedIndex();
    return this.selectedListIndex != null ? this.selectedListIndex : (selectedIndex != null ? selectedIndex : -1);
  }

  protected setSelectedListIndex(index: number): void {
    this.selectedListIndex = index;
  }

  public abstract onEnterKey(event: any): void;

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

  public callOnLeave(event: any): void {
    this.hideList();
    super.callOnLeave(event);
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
    this.containerStyle = this.createContainerStyle(wrapper);
    this.controlStyle = this.createControlStyle(wrapper);
    this.dropDownStyle = this.createDropDownStyle(wrapper);
    this.dropDownScrollerStyle = this.createDropDownScrollerStyle(wrapper);
  }

  protected createContainerStyle(wrapper: ComboBoxWrapper): any {
    const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();

    return {
      'left.px': layoutableProperties.getX(),
      'top.px': layoutableProperties.getY(),
      'font-family': wrapper.getFontFamily(),
      'font-style': StyleUtil.getFontStyle(wrapper.getFontItalic()),
      'font-size.px': wrapper.getFontSize(),
      'display': !this.isVisible ? 'none' : null
    };
  }

  protected createControlStyle(wrapper: ComboBoxWrapper): any {
    const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();

    return {
      'min-width.px': 0,
      'min-height.px': 0,
      'width.px': layoutableProperties.getWidth(),
      'height.px': layoutableProperties.getHeight(),
      'color': StyleUtil.getForeColor(this.isEditable, wrapper.getForeColor()),
      'background-color': StyleUtil.getBackgroundColor(this.isEditable, wrapper.getBackColor()),
      'border-style': 'solid',
      'border-color': wrapper.getBorderColor(),
      'border-radius': StyleUtil.getFourValue('px',
        wrapper.getBorderRadiusTopLeft(),
        wrapper.getBorderRadiusTopRight(),
        wrapper.getBorderRadiusBottomRight(),
        wrapper.getBorderRadiusBottomLeft()),
      'border-width': StyleUtil.getFourValue('px',
        wrapper.getBorderThicknessTop(),
        wrapper.getBorderThicknessRight(),
        wrapper.getBorderThicknessBottom(),
        wrapper.getBorderThicknessLeft()),
      'margin': StyleUtil.getFourValue('px',
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

    return styles;
  }

  protected createDropDownStyle(wrapper: ComboBoxWrapper): any {
    const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();

    return {
      'top.px': layoutableProperties.getHeight() + wrapper.getMarginTop(),
      'left.px': wrapper.getMarginLeft(),
      'min-width.px': layoutableProperties.getWidth(),
      'border': '1px solid ' + wrapper.getBorderColor(),
      'border-radius': StyleUtil.getFourValue('px',
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
      'max-width.px': maxWidth > 0 ? maxWidth : null,
      'max-height.px': maxHeight > 0 ? maxHeight : null
    };
  }
}

import { EventEmitter, Output, ElementRef, Directive } from '@angular/core';

import { ILayoutableProperties } from 'app/layout/layoutable-properties.interface';

import { ControlComponent } from 'app/controls/control.component';
import { ButtonBaseWrapper } from 'app/wrappers/button-base-wrapper';

import * as StyleUtil from 'app/util/style-util';

@Directive()
export abstract class ButtonComponent extends ControlComponent {

  @Output()
  public onClick: EventEmitter<any>;

  public caption: string;
  public mapEnterToTab: boolean;
  public showCaption: boolean;
  public tabIndexAttr: number;
  public disabledAttr: boolean;
  public buttonStyle: any;

  protected abstract getButton(): ElementRef;

  public callOnClick(event?: any): void {
    if (this.getWrapper().hasOnClickEvent()) {
      this.onClick.emit(event);
    }
  }

  public callKeyDown(event: KeyboardEvent): void {
    this.getFocusService().setLastKeyEvent(event);

    if (event.key === 'Tab' || (event.key === 'Enter' && this.mapEnterToTab)) {
      if (event.shiftKey) {
        this.getWrapper().focusKeyboardPrevious();
      } else {
        this.getWrapper().focusKeyboardNext();
      }

      event.preventDefault();
    }
  }

  public getWrapper(): ButtonBaseWrapper {
    return super.getWrapper() as ButtonBaseWrapper;
  }

  public setWrapper(wrapper: ButtonBaseWrapper): void {
    super.setWrapper(wrapper);

    if (wrapper.hasOnClickEvent()) {
      this.onClick = new EventEmitter<any>();
    }
  }

  protected updateData(wrapper: ButtonBaseWrapper): void {
    super.updateData(wrapper);
    this.caption = wrapper.getCaption();
    this.mapEnterToTab = wrapper.mapEnterToTab();
    this.showCaption = wrapper.showCaption();
    this.tabIndexAttr = this.isEditable && wrapper.getTabStop() ? null : -1;
    this.disabledAttr = Boolean.nullIfFalse(!this.isEditable);
  }

  protected updateStyles(wrapper: ButtonBaseWrapper): void {
    super.updateStyles(wrapper);
    this.buttonStyle = this.createButtonStyle(wrapper);
  }

  protected createButtonStyle(wrapper: ButtonBaseWrapper): any {
    const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();
    const layoutWidth: number = layoutableProperties.getClientWidth();
    const layoutHeight: number = layoutableProperties.getClientHeight();
    const isSizeVisible: boolean = layoutWidth > 0 && layoutHeight > 0;

    return {
      'display': this.isVisible && isSizeVisible ? null : 'none',
      'left.rem': StyleUtil.pixToRem(layoutableProperties.getX()),
      'top.rem': StyleUtil.pixToRem(layoutableProperties.getY()),
      'width.rem': StyleUtil.pixToRem(layoutWidth),
      'height.rem': StyleUtil.pixToRem(layoutHeight),
      'color': StyleUtil.getForeColor(this.isEditable, wrapper.getForeColor()),
      'background-color': StyleUtil.getBackgroundColor(wrapper.getBackColor(), this.isEditable),
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
      'padding': StyleUtil.pixToRemFourValueStr(
        wrapper.getPaddingTop(),
        wrapper.getPaddingRight(),
        wrapper.getPaddingBottom(),
        wrapper.getPaddingLeft()),
      'font-family': wrapper.getFontFamily(),
      'font-style': StyleUtil.getFontStyle(wrapper.getFontItalic()),
      'font-size.rem': StyleUtil.pixToRem(wrapper.getFontSize()),
      'font-weight': StyleUtil.getFontWeight(wrapper.getFontBold()),
      'line-height.rem': StyleUtil.pixToRem(wrapper.getLineHeight()),
      'text-decoration': StyleUtil.getTextDecoration(wrapper.getFontUnderline()),
      'text-align': 'center'
    };
  }

  public setFocus(): void {
    const button: ElementRef = this.getButton();

    if (button) {
      button.nativeElement.focus();
    }
  }
}

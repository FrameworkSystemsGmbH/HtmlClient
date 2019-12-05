import { Component, ElementRef, ViewChild } from '@angular/core';

import { TextBoxComponent } from 'app/controls/textboxes/textbox.component';
import { TextBoxMultilineWrapper } from 'app/wrappers/textbox-multiline-wrapper';
import { StyleUtil } from 'app/util/style-util';
import { ScrollBars } from 'app/enums/scrollbars';
import { ILayoutableProperties } from 'app/layout/layoutable-properties.interface';

@Component({
  selector: 'hc-txt-multiline',
  templateUrl: './textbox-multiline.component.html',
  styleUrls: ['./textbox-multiline.component.scss']
})
export class TextBoxMultilineComponent extends TextBoxComponent {

  @ViewChild('textarea', { static: true })
  public textarea: ElementRef;

  public value: string;
  public wrapperStyle: any;

  public getInput(): ElementRef {
    return this.textarea;
  }

  protected mapEnterToTab(): boolean {
    return false;
  }

  public callOnLeave(event: any): void {
    if (this.isEditable) {
      this.updateWrapper();
      super.callOnLeave(event);
    }
  }

  public getWrapper(): TextBoxMultilineWrapper {
    return super.getWrapper() as TextBoxMultilineWrapper;
  }

  public onAfterEnter(): void {
    // Overwritten to prevent text selection on focus
  }

  private updateWrapper(): void {
    this.getWrapper().setValue(this.value);
  }

  protected updateData(wrapper: TextBoxMultilineWrapper): void {
    super.updateData(wrapper);
    this.value = wrapper.getValue();
  }

  protected updateStyles(wrapper: TextBoxMultilineWrapper): void {
    super.updateStyles(wrapper);
    this.wrapperStyle = this.createWrapperStyle(wrapper);
  }

  protected createWrapperStyle(wrapper: TextBoxMultilineWrapper): any {
    const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();
    const layoutWidth: number = layoutableProperties.getClientWidth();
    const layoutHeight: number = layoutableProperties.getClientHeight();
    const isSizeVisible: boolean = layoutWidth > 0 && layoutHeight > 0;

    return {
      'display': this.isVisible && isSizeVisible ? null : 'none',
      'left.rem': StyleUtil.pixToRem(layoutableProperties.getX()),
      'top.rem': StyleUtil.pixToRem(layoutableProperties.getY()),
      'min-width.rem': 0,
      'min-height.rem': 0,
      'width.rem': StyleUtil.pixToRem(layoutWidth),
      'height.rem': StyleUtil.pixToRem(layoutHeight),
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
        wrapper.getMarginLeft())
    };
  }

  protected createInputStyle(wrapper: TextBoxMultilineWrapper): any {
    const scrollBars: ScrollBars = wrapper.getScrollBars();

    return {
      'color': StyleUtil.getForeColor(this.isEditable, wrapper.getForeColor()),
      'background-color': StyleUtil.getBackgroundColorTextInput(wrapper.getBackColor(), this.isEditable, this.isOutlineVisible()),
      'border': 'none',
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
      'overflow-x': StyleUtil.getOverflowX(scrollBars, wrapper.getWordWrap()),
      'overflow-y': StyleUtil.getOverflowY(scrollBars),
      'text-decoration': StyleUtil.getTextDecoration(wrapper.getFontUnderline()),
      'text-align': StyleUtil.getTextAlign(wrapper.getTextAlign()),
      'word-wrap': StyleUtil.getWordWrap(wrapper.getWordWrap()),
      'white-space': StyleUtil.getWhiteSpace(wrapper.getWordWrap())
    };
  }
}

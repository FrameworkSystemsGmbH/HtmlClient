import { Component, ElementRef, ViewChild } from '@angular/core';

import { TextBoxComponent } from 'app/controls/textbox.component';
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

  @ViewChild('textarea')
  public textarea: ElementRef;

  public value: string;
  public wrapperStyle: any;

  public getInput(): ElementRef {
    return this.textarea;
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

  protected updateProperties(wrapper: TextBoxMultilineWrapper): void {
    super.updateProperties(wrapper);
    this.value = wrapper.getValue();
  }

  protected updateStyles(wrapper: TextBoxMultilineWrapper): void {
    super.updateStyles(wrapper);
    this.wrapperStyle = this.createWrapperStyle(wrapper);
  }

  protected createWrapperStyle(wrapper: TextBoxMultilineWrapper): any {
    const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();

    return {
      'left.px': layoutableProperties.getX(),
      'top.px': layoutableProperties.getY(),
      'min-width.px': 0,
      'min-height.px': 0,
      'width.px': layoutableProperties.getWidth(),
      'height.px': layoutableProperties.getHeight(),
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
      'display': !this.isVisible ? 'none' : null
    };
  }

  protected createInputStyle(wrapper: TextBoxMultilineWrapper): any {
    const scrollBars: ScrollBars = wrapper.getScrollBars();

    return {
      'color': StyleUtil.getForeColor(this.isEditable, wrapper.getForeColor()),
      'background-color': StyleUtil.getBackgroundColor(this.isEditable, wrapper.getBackColor()),
      'border': 'none',
      'padding': StyleUtil.getFourValue('px',
        wrapper.getPaddingTop(),
        wrapper.getPaddingRight(),
        wrapper.getPaddingBottom(),
        wrapper.getPaddingLeft()),
      'font-family': wrapper.getFontFamily(),
      'font-style': StyleUtil.getFontStyle(wrapper.getFontItalic()),
      'font-size.px': wrapper.getFontSize(),
      'font-weight': StyleUtil.getFontWeight(wrapper.getFontBold()),
      'line-height.px': wrapper.getLineHeight(),
      'overflow-x': StyleUtil.getOverflowX(scrollBars),
      'overflow-y': StyleUtil.getOverflowY(scrollBars),
      'text-decoration': StyleUtil.getTextDecoration(wrapper.getFontUnderline()),
      'text-align': StyleUtil.getTextAlign(wrapper.getTextAlign()),
      'white-space': StyleUtil.getWordWrap(wrapper.getWordWrap())
    };
  }
}

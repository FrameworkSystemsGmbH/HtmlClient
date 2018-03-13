import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';

import { TextBoxComponent } from 'app/controls/textbox.component';
import { TextBoxMultilineWrapper } from 'app/wrappers/textbox-multiline-wrapper';
import { StyleUtil } from 'app/util/style-util';
import { ScrollBars } from 'app/enums/scrollbars';
import { ILayoutableProperties } from 'app/layout/layoutable-properties.interface';
import { ControlVisibility } from 'app/enums/control-visibility';

@Component({
  selector: 'hc-txt-multiline',
  templateUrl: './textbox-multiline.component.html',
  styleUrls: ['./textbox-multiline.component.scss']
})
export class TextBoxMultilineComponent extends TextBoxComponent implements OnInit {

  @ViewChild('textarea')
  public textarea: ElementRef;

  public value: string;

  public ngOnInit(): void {
    this.updateComponent();
  }

  public getInput(): ElementRef {
    return this.textarea;
  }

  public callOnLeave(event: any): void {
    const wrapper: TextBoxMultilineWrapper = this.getWrapper();
    if (wrapper.getIsEditable()) {
      this.updateWrapper();
      super.callOnLeave(event);
    }
  }

  public getWrapper(): TextBoxMultilineWrapper {
    return super.getWrapper() as TextBoxMultilineWrapper;
  }

  public setFocus(): void {
    this.textarea.nativeElement.focus();
  }

  public onAfterEnter(): void {
    // Override selection on focus
  }

  public updateComponent(): void {
    this.value = this.getWrapper().getValue();
  }

  private updateWrapper(): void {
    this.getWrapper().setValue(this.value);
  }

  public getWrapperStyles(): any {
    const wrapper: TextBoxMultilineWrapper = this.getWrapper();
    const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();

    const styles: any = {
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
        wrapper.getMarginLeft())
    };

    if (wrapper.getVisibility() === ControlVisibility.Collapsed) {
      styles['display'] = 'none';
    }

    return styles;
  }

  public getTextAreaStyles(): any {
    const wrapper: TextBoxMultilineWrapper = this.getWrapper();
    const scrollBars: ScrollBars = wrapper.getScrollBars();

    const styles: any = {
      'color': StyleUtil.getForeColor(wrapper.getIsEditable(), wrapper.getForeColor()),
      'background-color': StyleUtil.getBackgroundColor(wrapper.getIsEditable(), wrapper.getBackColor()),
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

    return styles;
  }
}

import { Component } from '@angular/core';

import { ILayoutableProperties } from 'app/layout/layoutable-properties.interface';

import { LayoutableComponent } from 'app/controls/layoutable.component';
import { ControlLabelWrapper } from 'app/wrappers/control-labels/control-label-wrapper';
import { Visibility } from 'app/enums/visibility';
import { StyleUtil } from 'app/util/style-util';

@Component({
  selector: 'hc-ctrl-lbl',
  templateUrl: './control-label.component.html',
  styleUrls: ['./control-label.component.scss']
})
export class ControlLabelComponent extends LayoutableComponent {

  public caption: string;
  public isEditable: boolean;
  public isVisible: boolean;
  public labelStyle: any;

  public getWrapper(): ControlLabelWrapper {
    return super.getWrapper() as ControlLabelWrapper;
  }

  protected updateData(wrapper: ControlLabelWrapper): void {
    super.updateData(wrapper);
    this.caption = wrapper.getDisplayCaption();
    this.isEditable = wrapper.getCurrentIsEditable();
    this.isVisible = wrapper.getCurrentVisibility() === Visibility.Visible;
  }

  protected updateStyles(wrapper: ControlLabelWrapper): void {
    super.updateStyles(wrapper);
    this.labelStyle = this.createLabelStyle(wrapper);
  }

  protected createLabelStyle(wrapper: ControlLabelWrapper): any {
    const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();
    const layoutWidth: number = layoutableProperties.getWidth();
    const layoutHeight: number = layoutableProperties.getHeight();
    const isSizeVisible: boolean = layoutWidth > 0 && layoutHeight > 0;

    return {
      'display': this.isVisible && isSizeVisible ? null : 'none',
      'left.rem': StyleUtil.pixToRem(layoutableProperties.getX()),
      'top.rem': StyleUtil.pixToRem(layoutableProperties.getY()),
      'width.rem': StyleUtil.pixToRem(layoutWidth),
      'height.rem': StyleUtil.pixToRem(layoutHeight),
      'color': StyleUtil.getForeColor(this.isEditable, wrapper.getForeColor()),
      'background-color': wrapper.getBackColor(),
      'border-style': 'none',
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
      'text-align': StyleUtil.getTextAlign(wrapper.getTextAlign())
    };
  }
}

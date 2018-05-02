import { Component } from '@angular/core';

import { ILayoutableProperties } from 'app/layout/layoutable-properties.interface';

import { LayoutableComponent } from 'app/controls/layoutable.component';
import { ControlLabelWrapper } from 'app/wrappers/control-labels/control-label-wrapper';
import { StyleUtil } from 'app/util/style-util';

@Component({
  selector: 'hc-ctrl-lbl',
  templateUrl: './control-label.component.html',
  styleUrls: ['./control-label.component.scss']
})
export class ControlLabelComponent extends LayoutableComponent {

  public caption: string;
  public labelStyle: any;

  public getWrapper(): ControlLabelWrapper {
    return super.getWrapper() as ControlLabelWrapper;
  }

  protected updateData(wrapper: ControlLabelWrapper): void {
    super.updateData(wrapper);
    this.caption = wrapper.getDisplayCaption();
  }

  protected updateStyles(wrapper: ControlLabelWrapper): void {
    super.updateStyles(wrapper);
    this.labelStyle = this.createLabelStyle(wrapper);
  }

  protected createLabelStyle(wrapper: ControlLabelWrapper): any {
    const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();

    return {
      'left.px': layoutableProperties.getX(),
      'top.px': layoutableProperties.getY(),
      'width.px': layoutableProperties.getWidth(),
      'height.px': layoutableProperties.getHeight(),
      'color': StyleUtil.getForeColor(wrapper.getIsEditable(), wrapper.getForeColor()),
      'background-color': wrapper.getBackColor(),
      'border-style': 'none',
      'margin': StyleUtil.getFourValue('px',
        wrapper.getMarginTop(),
        wrapper.getMarginRight(),
        wrapper.getMarginBottom(),
        wrapper.getMarginLeft()),
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
      'text-decoration': StyleUtil.getTextDecoration(wrapper.getFontUnderline()),
      'text-align': StyleUtil.getTextAlign(wrapper.getTextAlign())
    };
  }
}

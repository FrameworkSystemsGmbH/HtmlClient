import { Component } from '@angular/core';

import { LayoutableComponent } from 'app/controls/layoutable.component';
import { ControlLabelWrapper } from 'app/wrappers/control-labels/control-label-wrapper';
import { ControlVisibility } from '../../enums/control-visibility';
import { StyleUtil } from '../../util/style-util';

@Component({
  selector: 'hc-ctrl-lbl',
  templateUrl: './control-label.component.html',
  styleUrls: ['./control-label.component.scss']
})
export class ControlLabelComponent extends LayoutableComponent {

  public getWrapper(): ControlLabelWrapper {
    return super.getWrapper() as ControlLabelWrapper;
  }

  public getCaption(): string {
    return this.getWrapper().getDisplayCaption();
  }

  public getStyles(): any {
    const wrapper: ControlLabelWrapper = this.getWrapper();

    const styles: any = {
      'left.px': wrapper.getLayoutableProperties().getX(),
      'top.px': wrapper.getLayoutableProperties().getY(),
      'width.px': wrapper.getLayoutableProperties().getWidth(),
      'height.px': wrapper.getLayoutableProperties().getHeight(),
      'color': StyleUtil.getForeColor(wrapper.getIsEditable(), wrapper.getForeColor()),
      'background-color': StyleUtil.getBackgroundColor(wrapper.getIsEditable(), wrapper.getBackColor()),
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
      'line-height.px': wrapper.getFontSize(),
      'text-decoration': StyleUtil.getTextDecoration(wrapper.getFontUnderline()),
      'text-align': StyleUtil.getTextAlign(wrapper.getTextAlign())
    };

    if (wrapper.getVisibility() === ControlVisibility.Collapsed) {
      styles['display'] = 'none';
    }

    return styles;
  }
}

import { Component, ViewChild, ViewContainerRef } from '@angular/core';

import { ContainerComponent } from '..';
import { WrapPanelWrapper } from '../../wrappers';
import { ControlVisibility } from '../../enums/index';
import { StyleUtil } from '../../util';

@Component({
  selector: 'hc-wrp-panel',
  templateUrl: './wrap-panel.component.html',
  styleUrls: ['./wrap-panel.component.scss']
})
export class WrapPanelComponent extends ContainerComponent {

  @ViewChild('anchor', { read: ViewContainerRef }) anchor: ViewContainerRef;

  public getWrapper(): WrapPanelWrapper {
    return super.getWrapper() as WrapPanelWrapper;
  }

  public getViewContainerRef(): ViewContainerRef {
    return this.anchor;
  }

  public getStyles(): any {
    let wrapper: WrapPanelWrapper = this.getWrapper();

    let styles: any = {
      'left.px': wrapper.getLayoutableProperties().getX(),
      'top.px': wrapper.getLayoutableProperties().getY(),
      'width.px': wrapper.getLayoutableProperties().getWidth(),
      'height.px': wrapper.getLayoutableProperties().getHeight(),
      'background-color': wrapper.getBackColor(),
      'border-radius': StyleUtil.getBorderRadius(wrapper.getBorderRadiusTopLeft(), wrapper.getBorderRadiusTopRight(), wrapper.getBorderRadiusBottomLeft(), wrapper.getBorderRadiusBottomRight()),
      'border-left': wrapper.getBorderThicknessLeft() + 'px solid',
      'border-right': wrapper.getBorderThicknessRight() + 'px solid',
      'border-top': wrapper.getBorderThicknessTop() + 'px solid',
      'border-bottom': wrapper.getBorderThicknessBottom() + 'px solid',
      'margin-left.px': wrapper.getMarginLeft(),
      'margin-right.px': wrapper.getMarginRight(),
      'margin-top.px': wrapper.getMarginTop(),
      'margin-bottom.px': wrapper.getMarginBottom(),
      'padding-left.px': wrapper.getPaddingLeft(),
      'padding-right.px': wrapper.getPaddingRight(),
      'padding-top.px': wrapper.getPaddingTop(),
      'padding-bottom.px': wrapper.getPaddingBottom()
    }

    if (wrapper.getVisibility() === ControlVisibility.Collapsed) {
      styles['display'] = 'none';
    }

    return styles;
  }

}

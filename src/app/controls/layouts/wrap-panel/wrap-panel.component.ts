import { Component, ViewChild, ViewContainerRef } from '@angular/core';

import { ILayoutableProperties } from 'app/layout/layoutable-properties.interface';

import { ContainerComponent } from 'app/controls/container.component';
import { WrapPanelWrapper } from 'app/wrappers/wrap-panel-wrapper';
import { StyleUtil } from 'app/util/style-util';

@Component({
  selector: 'hc-wrp-panel',
  templateUrl: './wrap-panel.component.html',
  styleUrls: ['./wrap-panel.component.scss']
})
export class WrapPanelComponent extends ContainerComponent {

  @ViewChild('anchor', { read: ViewContainerRef })
  public anchor: ViewContainerRef;

  public wrapperStyle: any;

  public getWrapper(): WrapPanelWrapper {
    return super.getWrapper() as WrapPanelWrapper;
  }

  public getViewContainerRef(): ViewContainerRef {
    return this.anchor;
  }

  protected updateStyles(wrapper: WrapPanelWrapper): void {
    super.updateStyles(wrapper);
    this.wrapperStyle = this.createWrapperStyle(wrapper);
  }

  protected createWrapperStyle(wrapper: WrapPanelWrapper): any {
    const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();
    const layoutWidth: number = layoutableProperties.getWidth();
    const layoutHeight: number = layoutableProperties.getHeight();
    const isSizeVisible: boolean = layoutWidth > 0 && layoutHeight > 0;

    return {
      'display': this.isVisible && isSizeVisible ? null : 'none',
      'left.px': layoutableProperties.getX(),
      'top.px': layoutableProperties.getY(),
      'width.px': layoutWidth,
      'height.px': layoutHeight,
      'background-color': wrapper.getBackColor(),
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
      'padding': StyleUtil.getFourValue('px',
        wrapper.getPaddingTop(),
        wrapper.getPaddingRight(),
        wrapper.getPaddingBottom(),
        wrapper.getPaddingLeft())
    };
  }
}

import { Component, ViewChild, ViewContainerRef } from '@angular/core';

import { ContainerComponent } from 'app/controls/container.component';
import { FieldPanelWrapper } from 'app/wrappers/field-panel-wrapper';
import { StyleUtil } from 'app/util/style-util';

@Component({
  selector: 'hc-field-panel',
  templateUrl: './field-panel.component.html',
  styleUrls: ['./field-panel.component.scss']
})
export class FieldPanelComponent extends ContainerComponent {

  @ViewChild('anchor', { read: ViewContainerRef })
  public anchor: ViewContainerRef;

  public wrapperStyle: any;

  public getWrapper(): FieldPanelWrapper {
    return super.getWrapper() as FieldPanelWrapper;
  }

  public getViewContainerRef(): ViewContainerRef {
    return this.anchor;
  }

  protected updateStyles(wrapper: FieldPanelWrapper): void {
    this.wrapperStyle = this.createWrapperStyle(wrapper);
  }

  protected createWrapperStyle(wrapper: FieldPanelWrapper): any {
    return {
      'left.px': wrapper.getLayoutableProperties().getX(),
      'top.px': wrapper.getLayoutableProperties().getY(),
      'width.px': wrapper.getLayoutableProperties().getWidth(),
      'height.px': wrapper.getLayoutableProperties().getHeight(),
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
        wrapper.getPaddingLeft()),
      'display': !this.isVisible ? 'none' : null
    };
  }
}

import { Component, ViewChild, ViewContainerRef } from '@angular/core';

import { ContainerComponent } from 'app/controls/container.component';
import { DockPanelWrapper } from 'app/wrappers/dock-panel-wrapper';
import { ControlVisibility } from 'app/enums/control-visibility';
import { StyleUtil } from 'app/util/style-util';

@Component({
  selector: 'hc-dock-panel',
  templateUrl: './dock-panel.component.html',
  styleUrls: ['./dock-panel.component.scss']
})
export class DockPanelComponent extends ContainerComponent {

  @ViewChild('anchor', { read: ViewContainerRef })
  public anchor: ViewContainerRef;

  public getWrapper(): DockPanelWrapper {
    return super.getWrapper() as DockPanelWrapper;
  }

  public getViewContainerRef(): ViewContainerRef {
    return this.anchor;
  }

  public getStyles(): any {
    const wrapper: DockPanelWrapper = this.getWrapper();

    const styles: any = {
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
        wrapper.getPaddingLeft())
    };

    if (wrapper.getVisibility() === ControlVisibility.Collapsed) {
      styles['display'] = 'none';
    }

    return styles;
  }

}

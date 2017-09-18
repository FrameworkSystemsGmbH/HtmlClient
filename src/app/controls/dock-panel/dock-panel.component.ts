import { Component, ViewChild, ViewContainerRef } from '@angular/core';

import { ContainerComponent } from '..';
import { DockPanelWrapper } from '../../wrappers';
import { ControlVisibility } from '../../enums/index';

@Component({
  selector: 'hc-dock-panel',
  templateUrl: './dock-panel.component.html',
  styleUrls: ['./dock-panel.component.scss']
})
export class DockPanelComponent extends ContainerComponent {

  @ViewChild('anchor', { read: ViewContainerRef }) anchor: ViewContainerRef;

  public getWrapper(): DockPanelWrapper {
    return super.getWrapper() as DockPanelWrapper;
  }

  public getViewContainerRef(): ViewContainerRef {
    return this.anchor;
  }

  public getStyles(): any {
    let wrapper: DockPanelWrapper = this.getWrapper();

    let styles: any = {
      'left.px': wrapper.getLayoutableProperties().getX(),
      'top.px': wrapper.getLayoutableProperties().getY(),
      'width.px': wrapper.getLayoutableProperties().getWidth(),
      'height.px': wrapper.getLayoutableProperties().getHeight(),
      'background-color': wrapper.getBackColor(),
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

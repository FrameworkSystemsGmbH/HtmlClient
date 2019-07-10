import { Component, ViewChild, ViewContainerRef } from '@angular/core';

import { ILayoutableProperties } from 'app/layout/layoutable-properties.interface';

import { LayoutableComponent } from 'app/controls/layoutable.component';
import { ControlLabelContainerBaseWrapper } from 'app/wrappers/control-labels/control-label-container-base-wrapper';
import { Visibility } from 'app/enums/visibility';

@Component({
  selector: 'hc-ctrl-lbl-cont',
  templateUrl: './control-label-container.component.html',
  styleUrls: ['./control-label-container.component.scss']
})
export class ControlLabelContainerComponent extends LayoutableComponent {

  @ViewChild('anchor', { read: ViewContainerRef, static: true })
  public anchor: ViewContainerRef;

  public isVisible: boolean;
  public wrapperStyle: any;

  public getWrapper(): ControlLabelContainerBaseWrapper {
    return super.getWrapper() as ControlLabelContainerBaseWrapper;
  }

  public getViewContainerRef(): ViewContainerRef {
    return this.anchor;
  }

  protected updateData(wrapper: ControlLabelContainerBaseWrapper): void {
    super.updateData(wrapper);
    this.isVisible = wrapper.getCurrentVisibility() === Visibility.Visible;
  }

  protected updateStyles(wrapper: ControlLabelContainerBaseWrapper): void {
    super.updateStyles(wrapper);
    this.wrapperStyle = this.createWrapperStyle(wrapper);
  }

  protected createWrapperStyle(wrapper: ControlLabelContainerBaseWrapper): any {
    const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();
    const layoutWidth: number = layoutableProperties.getWidth();
    const layoutHeight: number = layoutableProperties.getHeight();
    const isSizeVisible: boolean = layoutWidth > 0 && layoutHeight > 0;

    return {
      'display': this.isVisible && isSizeVisible ? null : 'none',
      'left.px': layoutableProperties.getX(),
      'top.px': layoutableProperties.getY(),
      'width.px': layoutWidth,
      'height.px': layoutHeight
    };
  }
}

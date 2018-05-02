import { Component, ViewChild, ViewContainerRef } from '@angular/core';

import { ILayoutableProperties } from 'app/layout/layoutable-properties.interface';

import { LayoutableComponent } from 'app/controls/layoutable.component';
import { ControlLabelContainerWrapper } from 'app/wrappers/control-labels/control-label-container-wrapper';

@Component({
  selector: 'hc-ctrl-lbl-cont',
  templateUrl: './control-label-container.component.html',
  styleUrls: ['./control-label-container.component.scss']
})
export class ControlLabelContainerComponent extends LayoutableComponent {

  @ViewChild('anchor', { read: ViewContainerRef })
  public anchor: ViewContainerRef;

  public wrapperStyle: any;

  public getWrapper(): ControlLabelContainerWrapper {
    return super.getWrapper() as ControlLabelContainerWrapper;
  }

  public getViewContainerRef(): ViewContainerRef {
    return this.anchor;
  }

  protected updateStyles(wrapper: ControlLabelContainerWrapper): void {
    super.updateStyles(wrapper);
    this.wrapperStyle = this.createWrapperStyle(wrapper);
  }

  protected createWrapperStyle(wrapper: ControlLabelContainerWrapper): any {
    const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();

    return {
      'left.px': layoutableProperties.getX(),
      'top.px': layoutableProperties.getY(),
      'width.px': layoutableProperties.getWidth(),
      'height.px': layoutableProperties.getHeight()
    };
  }
}

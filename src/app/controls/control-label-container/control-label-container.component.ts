import { Component, ViewChild, ViewContainerRef } from '@angular/core';

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

  protected updateProperties(wrapper: ControlLabelContainerWrapper): void {
    // No properties to set
  }

  protected updateStyles(wrapper: ControlLabelContainerWrapper): void {
    this.wrapperStyle = this.createWrapperStyle(wrapper);
  }

  protected createWrapperStyle(wrapper: ControlLabelContainerWrapper): any {
    return {
      'left.px': wrapper.getLayoutableProperties().getX(),
      'top.px': wrapper.getLayoutableProperties().getY(),
      'width.px': wrapper.getLayoutableProperties().getWidth(),
      'height.px': wrapper.getLayoutableProperties().getHeight()
    };
  }
}

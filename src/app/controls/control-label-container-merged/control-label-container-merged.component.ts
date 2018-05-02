import { Component, ViewChild, ViewContainerRef } from '@angular/core';

import { ILayoutableProperties } from 'app/layout/layoutable-properties.interface';

import { LayoutableComponent } from 'app/controls/layoutable.component';
import { ControlLabelContainerMergedWrapper } from 'app/wrappers/control-labels/control-label-container-merged-wrapper';

@Component({
  selector: 'hc-ctrl-lbl-cont-merged',
  templateUrl: './control-label-container-merged.component.html',
  styleUrls: ['./control-label-container-merged.component.scss']
})
export class ControlLabelContainerMergedComponent extends LayoutableComponent {

  @ViewChild('anchor', { read: ViewContainerRef })
  public anchor: ViewContainerRef;

  public wrapperStyle: any;

  public getWrapper(): ControlLabelContainerMergedWrapper {
    return super.getWrapper() as ControlLabelContainerMergedWrapper;
  }

  public getViewContainerRef(): ViewContainerRef {
    return this.anchor;
  }

  protected updateStyles(wrapper: ControlLabelContainerMergedWrapper): void {
    super.updateStyles(wrapper);
    this.wrapperStyle = this.createWrapperStyle(wrapper);
  }

  protected createWrapperStyle(wrapper: ControlLabelContainerMergedWrapper): any {
    const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();

    return {
      'left.px': layoutableProperties.getX(),
      'top.px': layoutableProperties.getY(),
      'width.px': layoutableProperties.getWidth(),
      'height.px': layoutableProperties.getHeight()
    };
  }
}

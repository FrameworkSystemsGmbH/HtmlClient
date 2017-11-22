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

  public getWrapper(): ControlLabelContainerWrapper {
    return super.getWrapper() as ControlLabelContainerWrapper;
  }

  public getViewContainerRef(): ViewContainerRef {
    return this.anchor;
  }

  public getStyles(): any {
    const wrapper: ControlLabelContainerWrapper = this.getWrapper();

    const styles: any = {
      'left.px': wrapper.getLayoutableProperties().getX(),
      'top.px': wrapper.getLayoutableProperties().getY(),
      'width.px': wrapper.getLayoutableProperties().getWidth(),
      'height.px': wrapper.getLayoutableProperties().getHeight()
    };

    return styles;
  }
}

import { Component, ViewChild, ViewContainerRef } from '@angular/core';

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

  public getWrapper(): ControlLabelContainerMergedWrapper {
    return super.getWrapper() as ControlLabelContainerMergedWrapper;
  }

  public getViewContainerRef(): ViewContainerRef {
    return this.anchor;
  }

  public getStyles(): any {
    const wrapper: ControlLabelContainerMergedWrapper = this.getWrapper();

    const styles: any = {
      'left.px': wrapper.getLayoutableProperties().getX(),
      'top.px': wrapper.getLayoutableProperties().getY(),
      'width.px': wrapper.getLayoutableProperties().getWidth(),
      'height.px': wrapper.getLayoutableProperties().getHeight()
    };

    return styles;
  }
}

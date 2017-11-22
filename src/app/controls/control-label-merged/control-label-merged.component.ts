import { Component, ViewChild, ViewContainerRef } from '@angular/core';

import { LayoutableComponent } from 'app/controls/layoutable.component';
import { ControlLabelMergedWrapper } from 'app/wrappers/control-labels/control-label-merged-wrapper';

@Component({
  selector: 'hc-ctrl-lbl-merged',
  templateUrl: './control-label-merged.component.html',
  styleUrls: ['./control-label-merged.component.scss']
})
export class ControlLabelMergedComponent extends LayoutableComponent {

  @ViewChild('anchor', { read: ViewContainerRef })
  public anchor: ViewContainerRef;

  public getWrapper(): ControlLabelMergedWrapper {
    return super.getWrapper() as ControlLabelMergedWrapper;
  }

  public getViewContainerRef(): ViewContainerRef {
    return this.anchor;
  }

  public getStyles(): any {
    const wrapper: ControlLabelMergedWrapper = this.getWrapper();

    const styles: any = {
      'left.px': wrapper.getLayoutableProperties().getX(),
      'top.px': wrapper.getLayoutableProperties().getY(),
      'width.px': wrapper.getLayoutableProperties().getWidth(),
      'height.px': wrapper.getLayoutableProperties().getHeight()
    };

    return styles;
  }
}

import { ContainerWrapperSpaceable } from '.';
import { FieldContainer, FieldRowControl } from '../layout/field-layout';
import { LayoutControlLabelTemplate, LayoutControlLabel } from '../layout';
import { ControlLabelWrapper } from '.';
import { ViewContainerRef, ComponentRef } from '@angular/core';
import { LabelComponent } from '../controls';

export class FieldPanelWrapper extends ContainerWrapperSpaceable implements FieldContainer {

  public getLayoutControls(): Array<FieldRowControl> {
    return super.getLayoutControls() as Array<FieldRowControl>;
  }

  public getLayoutControlLabels(): Array<LayoutControlLabel> {
    let controlLabels = new Array<LayoutControlLabel>();
    for (let wrapper of this.getLayoutControls()) {
      if (wrapper instanceof ControlLabelWrapper) {
        controlLabels.push(wrapper);
      }
    }
    return controlLabels;
  }

  public getSynchronizeColumns(): boolean {
    return false;
  }

  public getRowLabelTemplate(): LayoutControlLabelTemplate {
    return null;
  }

  public createComponent(): ComponentRef<LabelComponent> {
    return null;
  }

  public getViewContainerRef(): ViewContainerRef {
    return null;
  }

}

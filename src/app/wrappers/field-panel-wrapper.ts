import { ContainerWrapperSpaceable } from './container-wrapper-spaceable';
import { ControlLabelWrapper } from './control-label-wrapper';
import { ViewContainerRef, ComponentRef } from '@angular/core';
import { LabelComponent } from '../controls/label/label.component';
import { FieldContainer } from '../layout/field-layout/field-container';
import { FieldRowControl } from '../layout/field-layout/field-row-control';
import { LayoutableControlLabel } from '../layout/layoutable-control-label';
import { LayoutableControlLabelTemplate } from '../layout/layoutable-control-label-template';

export class FieldPanelWrapper extends ContainerWrapperSpaceable implements FieldContainer {

  public getLayoutableControls(): Array<FieldRowControl> {
    return super.getLayoutableControls() as Array<FieldRowControl>;
  }

  public getLayoutableControlLabels(): Array<LayoutableControlLabel> {
    let controlLabels = new Array<LayoutableControlLabel>();
    for (let wrapper of this.getLayoutableControls()) {
      if (wrapper instanceof ControlLabelWrapper) {
        controlLabels.push(wrapper);
      }
    }
    return controlLabels;
  }

  public getSynchronizeColumns(): boolean {
    return false;
  }

  public getRowLabelTemplate(): LayoutableControlLabelTemplate {
    return null;
  }

  public createComponent(): ComponentRef<LabelComponent> {
    return null;
  }

  public getViewContainerRef(): ViewContainerRef {
    return null;
  }

}

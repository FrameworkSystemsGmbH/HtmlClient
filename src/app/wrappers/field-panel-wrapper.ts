import { ContainerWrapperSpaceable } from './container-wrapper-spaceable';
import { ControlLabelWrapper } from './control-label-wrapper';
import { ViewContainerRef, ComponentRef } from '@angular/core';
import { LabelComponent } from '../controls/label/label.component';
import { IFieldContainer } from '../layout/field-layout/field-container';
import { IFieldRowControl } from '../layout/field-layout/field-row-control';
import { ILayoutableControlLabel } from '../layout/layoutable-control-label';
import { ILayoutableControlLabelTemplate } from '../layout/layoutable-control-label-template';

export class FieldPanelWrapper extends ContainerWrapperSpaceable implements IFieldContainer {

  public getLayoutableControls(): Array<IFieldRowControl> {
    return super.getLayoutableControls() as Array<IFieldRowControl>;
  }

  public getLayoutableControlLabels(): Array<ILayoutableControlLabel> {
    const controlLabels = new Array<ILayoutableControlLabel>();
    for (const wrapper of this.getLayoutableControls()) {
      if (wrapper instanceof ControlLabelWrapper) {
        controlLabels.push(wrapper);
      }
    }
    return controlLabels;
  }

  public getSynchronizeColumns(): boolean {
    return false;
  }

  public getRowLabelTemplate(): ILayoutableControlLabelTemplate {
    return null;
  }

  public createComponent(): ComponentRef<LabelComponent> {
    return null;
  }

  public getViewContainerRef(): ViewContainerRef {
    return null;
  }

}

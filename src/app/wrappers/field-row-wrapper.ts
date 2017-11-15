import { ViewContainerRef, ComponentRef } from '@angular/core';

import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';
import { IFieldContainer } from 'app/layout/field-layout/field-container.interface';
import { IFieldRowControl } from 'app/layout/field-layout/field-row-control.interface';

import { ControlComponent } from 'app/controls/control.component';
import { ContainerWrapper } from 'app/wrappers/container-wrapper';
import { FieldPanelWrapper } from 'app/wrappers/field-panel-wrapper';
import { FieldRowLabelMode } from 'app/layout/field-layout/field-row-label-mode';

export class FieldRowWrapper extends ContainerWrapper implements IFieldRowControl {

  public getFieldRowLabelMode(): FieldRowLabelMode {
    const labelMode: FieldRowLabelMode = this.getPropertyStore().getLabelMode();
    return labelMode != null ? labelMode : FieldRowLabelMode.Generated;
  }

  public getParent(): FieldPanelWrapper {
    return super.getParent() as FieldPanelWrapper;
  }

  public getFieldContainer(): IFieldContainer {
    return this.getParent() as IFieldContainer;
  }

  public getViewContainerRef(): ViewContainerRef {
    throw new Error('FieldRowWrapper never gets rendered to the UI! This method should not be called!');
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<ControlComponent> {
    throw new Error('FieldRowWrapper never gets rendered to the UI! This method should not be called!');
  }

  public attachComponent(container: ILayoutableContainerWrapper): void {
    this.attachSubComponents(container);
  }
}

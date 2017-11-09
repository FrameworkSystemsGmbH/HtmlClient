import { ViewContainerRef } from '@angular/core';

import { IFieldRowControl } from 'app/layout/field-layout/field-row-control';
import { FieldRowLabelMode } from 'app/layout/field-layout/field-row-label-mode';
import { ContainerWrapper } from 'app/wrappers/container-wrapper';
import { IFieldContainer } from 'app/layout/field-layout/field-container';
import { FieldPanelWrapper } from 'app/wrappers/field-panel-wrapper';

export class FieldRowWrapper extends ContainerWrapper implements IFieldRowControl {

  public getFieldRowLabelMode(): FieldRowLabelMode {
    const labelMode: FieldRowLabelMode = this.propertyStore.getLabelMode();
    return labelMode != null ? labelMode : FieldRowLabelMode.Generated;
  }

  public getParent(): FieldPanelWrapper {
    return super.getParent() as FieldPanelWrapper;
  }

  public getFieldContainer(): IFieldContainer {
    return this.getParent() as IFieldContainer;
  }

  public getViewContainerRef(): ViewContainerRef {
    return this.getParent().getViewContainerRef();
  }

  public createComponent(container: ContainerWrapper): void {
    // FieldRowWrapper never gets rendered to the UI
  }
}

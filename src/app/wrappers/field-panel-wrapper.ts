import { ComponentRef, ComponentFactory, ViewContainerRef } from '@angular/core';

import { IFieldContainer } from 'app/layout/field-layout/field-container.interface';
import { IFieldRowControl } from 'app/layout/field-layout/field-row-control.interface';
import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';
import { ILayoutableControlLabelTemplate } from 'app/layout/layoutable-control-label-template.interface';

import { LayoutBase } from 'app/layout/layout-base';
import { FieldLayout } from 'app/layout/field-layout/field-layout';
import { FieldPanelComponent } from 'app/controls/field-panel/field-panel.component';
import { ContainerWrapperSpaceable } from 'app/wrappers/container-wrapper-spaceable';
import { LayoutableControlLabelTemplate } from 'app/wrappers/layout/layoutable-control-label-template';

export class FieldPanelWrapper extends ContainerWrapperSpaceable implements IFieldContainer {

  private rowLabelTemplate: ILayoutableControlLabelTemplate;

  protected createLayout(): LayoutBase {
    return new FieldLayout(this);
  }

  public getLayoutableControls(): Array<IFieldRowControl> {
    return super.getLayoutableControls() as Array<IFieldRowControl>;
  }

  public getSynchronizeColumns(): boolean {
    return Boolean.falseIfNull(this.getPropertyStore().getSynchronizeColumns());
  }

  public getRowLabelTemplate(): ILayoutableControlLabelTemplate {
    if (!this.rowLabelTemplate) {
      this.rowLabelTemplate = new LayoutableControlLabelTemplate(this.getPropertyStore().getPropertyStore(data => data.rowLabelTemplate));
    }

    return this.rowLabelTemplate;
  }

  protected getComponentRef(): ComponentRef<FieldPanelComponent> {
    return super.getComponentRef() as ComponentRef<FieldPanelComponent>;
  }

  protected getComponent(): FieldPanelComponent {
    const compRef: ComponentRef<FieldPanelComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  public getViewContainerRef(): ViewContainerRef {
    return this.getComponent().anchor;
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<FieldPanelComponent> {
    const factory: ComponentFactory<FieldPanelComponent> = this.getResolver().resolveComponentFactory(FieldPanelComponent);
    return factory.create(container.getViewContainerRef().injector);
  }
}

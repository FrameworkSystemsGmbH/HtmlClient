import { ComponentRef, ComponentFactory, ViewContainerRef } from '@angular/core';

import { IFieldContainer } from 'app/layout/field-layout/field-container';
import { IFieldRowControl } from 'app/layout/field-layout/field-row-control';
import { ILayoutableControlLabel } from 'app/layout/layoutable-control-label';
import { ILayoutableControlLabelTemplate } from 'app/layout/layoutable-control-label-template';

import { LayoutBase } from 'app/layout/layout-base';
import { FieldLayout } from 'app/layout/field-layout/field-layout';
import { FieldPanelComponent } from 'app/controls/field-panel/field-panel.component';
import { ContainerWrapper } from 'app/wrappers/container-wrapper';
import { ContainerWrapperSpaceable } from 'app/wrappers/container-wrapper-spaceable';
import { ControlLabelWrapper } from 'app/wrappers/control-label-wrapper';
import { LayoutableControlLabelTemplate } from 'app/wrappers/layout/layoutable-control-label-template';

export class FieldPanelWrapper extends ContainerWrapperSpaceable implements IFieldContainer {

  private rowLabelTemplate: ILayoutableControlLabelTemplate;

  protected createLayout(): LayoutBase {
    return new FieldLayout(this);
  }

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
    return Boolean.falseIfNull(this.propertyStore.getSynchronizeColumns());
  }

  public getRowLabelTemplate(): ILayoutableControlLabelTemplate {
    if (!this.rowLabelTemplate) {
      this.rowLabelTemplate = new LayoutableControlLabelTemplate(this.propertyStore.getPropertyStore(data => data.rowLabelTemplate));
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

  public createComponent(container: ContainerWrapper): void {
    const factory: ComponentFactory<FieldPanelComponent> = this.componentFactoryResolver.resolveComponentFactory(FieldPanelComponent);
    const comp: ComponentRef<FieldPanelComponent> = container.getViewContainerRef().createComponent(factory);
    const instance: FieldPanelComponent = comp.instance;

    this.setComponentRef(comp);
    instance.setWrapper(this);
    this.attachEvents(instance);
  }
}

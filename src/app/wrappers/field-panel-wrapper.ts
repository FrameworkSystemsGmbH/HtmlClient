import { ComponentFactory, ComponentRef, ViewContainerRef } from '@angular/core';
import { FieldPanelComponent } from '@app/controls/layouts/field-panel/field-panel.component';
import { ControlType } from '@app/enums/control-type';
import { IFieldContainer } from '@app/layout/field-layout/field-container.interface';
import { FieldLayout } from '@app/layout/field-layout/field-layout';
import { IFieldRowControl } from '@app/layout/field-layout/field-row-control.interface';
import { LayoutBase } from '@app/layout/layout-base';
import { ContainerWrapperSpaceable } from '@app/wrappers/container-wrapper-spaceable';
import { ControlLabelTemplate } from '@app/wrappers/control-labels/control-label-template';
import { ILayoutableContainerWrapper } from '@app/wrappers/layout/layoutable-container-wrapper.interface';

export class FieldPanelWrapper extends ContainerWrapperSpaceable implements IFieldContainer {

  private rowLabelTemplate: ControlLabelTemplate;

  public supportsButtonGroup(): boolean {
    return true;
  }

  public getControlType(): ControlType {
    return ControlType.FieldPanel;
  }

  protected createLayout(): LayoutBase {
    return new FieldLayout(this);
  }

  public getLayoutableControls(): Array<IFieldRowControl> {
    return super.getLayoutableControls() as Array<IFieldRowControl>;
  }

  public getSynchronizeColumns(): boolean {
    return Boolean.falseIfNull(this.getPropertyStore().getSynchronizeColumns());
  }

  public getRowLabelTemplate(): ControlLabelTemplate {
    if (!this.rowLabelTemplate) {
      this.rowLabelTemplate = new ControlLabelTemplate(this.getPropertyStore().getPropertyStore(data => data.rowLabelTemplate));
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

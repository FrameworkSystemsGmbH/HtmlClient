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

  private _rowLabelTemplate: ControlLabelTemplate | null = null;

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
    if (!this._rowLabelTemplate) {
      this._rowLabelTemplate = new ControlLabelTemplate(this.getPropertyStore().getPropertyStore(data => data.rowLabelTemplate));
    }

    return this._rowLabelTemplate;
  }

  protected getComponentRef(): ComponentRef<FieldPanelComponent> | null {
    return super.getComponentRef() as ComponentRef<FieldPanelComponent> | null;
  }

  protected getComponent(): FieldPanelComponent | null {
    const compRef: ComponentRef<FieldPanelComponent> | null = this.getComponentRef();
    return compRef ? compRef.instance : null;
  }

  public getViewContainerRef(): ViewContainerRef {
    const comp: FieldPanelComponent | null = this.getComponent();

    if (comp == null) {
      throw new Error('Tried to get FieldPanelComponent ViewContainerRef but component is NULL');
    }
    return comp.getViewContainerRef();
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<FieldPanelComponent> {
    const factory: ComponentFactory<FieldPanelComponent> = this.getResolver().resolveComponentFactory(FieldPanelComponent);
    return factory.create(container.getViewContainerRef().injector);
  }
}

import { ComponentFactory, ComponentRef, ViewContainerRef } from '@angular/core';
import { DockPanelComponent } from '@app/controls/layouts/dock-panel/dock-panel.component';
import { ControlType } from '@app/enums/control-type';
import { DockPanelScrolling } from '@app/enums/dockpanel-scrolling';
import { IDockContainer } from '@app/layout/dock-layout/dock-container.interface';
import { DockLayout } from '@app/layout/dock-layout/dock-layout';
import { DockOrientation } from '@app/layout/dock-layout/dock-orientation';
import { LayoutBase } from '@app/layout/layout-base';
import { ContainerWrapperSpaceable } from '@app/wrappers/container-wrapper-spaceable';
import { ILayoutableContainerWrapper } from '@app/wrappers/layout/layoutable-container-wrapper.interface';

export class DockPanelWrapper extends ContainerWrapperSpaceable implements IDockContainer {

  public supportsButtonGroup(): boolean {
    return true;
  }

  public getControlType(): ControlType {
    return ControlType.DockPanel;
  }

  protected createLayout(): LayoutBase {
    return new DockLayout(this);
  }

  protected getComponentRef(): ComponentRef<DockPanelComponent> | null {
    return super.getComponentRef() as ComponentRef<DockPanelComponent> | null;
  }

  protected getComponent(): DockPanelComponent | null {
    const compRef: ComponentRef<DockPanelComponent> | null = this.getComponentRef();
    return compRef ? compRef.instance : null;
  }

  public getViewContainerRef(): ViewContainerRef {
    const comp: DockPanelComponent | null = this.getComponent();

    if (comp == null) {
      throw new Error('Tried to get DockPanelComponent ViewContainerRef but component is NULL');
    }
    return comp.getViewContainerRef();
  }

  public getDockOrientation(): DockOrientation {
    const dockOrientation: DockOrientation | undefined = this.getPropertyStore().getDockOrientation();
    return dockOrientation != null ? dockOrientation : DockOrientation.Vertical;
  }

  public getDockPanelScrolling(): DockPanelScrolling {
    const dockPanelScrolling: DockPanelScrolling | undefined = this.getPropertyStore().getDockPanelScrolling();
    return dockPanelScrolling != null ? dockPanelScrolling : DockPanelScrolling.None;
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<DockPanelComponent> {
    const factory: ComponentFactory<DockPanelComponent> = this.getResolver().resolveComponentFactory(DockPanelComponent);
    return factory.create(container.getViewContainerRef().injector);
  }
}

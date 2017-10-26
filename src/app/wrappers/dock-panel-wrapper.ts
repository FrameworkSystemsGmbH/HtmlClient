import { ComponentFactory, ComponentRef, ViewContainerRef } from '@angular/core';

import { ContainerWrapper } from './container-wrapper';
import { ContainerWrapperSpaceable } from './container-wrapper-spaceable';
import { DockPanelComponent } from '../controls/dock-panel/dock-panel.component';
import { LayoutBase } from '../layout/layout-base';
import { DockLayout } from '../layout/dock-layout/dock-layout';
import { IDockContainer } from '../layout/dock-layout/dock-container';
import { DockOrientation } from '../layout/dock-layout/dock-orientation';

export class DockPanelWrapper extends ContainerWrapperSpaceable implements IDockContainer {

  protected createLayout(): LayoutBase {
    return new DockLayout(this);
  }

  protected getComponentRef(): ComponentRef<DockPanelComponent> {
    return super.getComponentRef() as ComponentRef<DockPanelComponent>;
  }

  protected getComponent(): DockPanelComponent {
    const compRef: ComponentRef<DockPanelComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  public getViewContainerRef(): ViewContainerRef {
    return this.getComponent().anchor;
  }

  public getDockOrientation(): DockOrientation {
    const dockOrientation: DockOrientation = this.propertyStore.getDockOrientation();
    return dockOrientation != null ? dockOrientation : DockOrientation.Vertical;
  }

  public createComponent(container: ContainerWrapper): void {
    const factory: ComponentFactory<DockPanelComponent> = this.componentFactoryResolver.resolveComponentFactory(DockPanelComponent);
    const comp: ComponentRef<DockPanelComponent> = container.getViewContainerRef().createComponent(factory);
    const instance: DockPanelComponent = comp.instance;

    this.setComponentRef(comp);
    instance.setWrapper(this);
    this.attachEvents(instance);
  }

}

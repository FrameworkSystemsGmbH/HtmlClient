import { ComponentFactory, ComponentRef, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';

import { LayoutBase } from '../layout';
import { DockPanelComponent } from '../controls';
import { DockContainer, DockOrientation, DockLayout } from '../layout/dock-layout';
import { ContainerWrapperSpaceable, ContainerWrapper } from '.';
import { HorizontalContentAlignment, VerticalContentAlignment } from '../enums';

export class DockPanelWrapper extends ContainerWrapperSpaceable implements DockContainer {

  protected createLayout(): LayoutBase {
    return new DockLayout(this);
  }

  protected getComponentRef(): ComponentRef<DockPanelComponent> {
    return <ComponentRef<DockPanelComponent>>super.getComponentRef();
  }

  protected getComponent(): DockPanelComponent {
    return this.getComponentRef().instance;
  }

  public getViewContainerRef(): ViewContainerRef {
    return this.getComponent().anchor;
  }

  public getDockOrientation(): DockOrientation {
    let dockOrientation: DockOrientation = this.propertyStore.getDockOrientation();
    return dockOrientation != null ? dockOrientation : DockOrientation.Vertical;
  }

  public createComponent(container: ContainerWrapper): void {
    let cfr: ComponentFactoryResolver = this.appInjector.get(ComponentFactoryResolver);
    let factory: ComponentFactory<DockPanelComponent> = cfr.resolveComponentFactory(DockPanelComponent);
    let comp: ComponentRef<DockPanelComponent> = container.getViewContainerRef().createComponent(factory);
    let instance: DockPanelComponent = comp.instance;

    this.setComponentRef(comp);
    instance.setWrapper(this);
    this.attachEvents(instance);
  }

}

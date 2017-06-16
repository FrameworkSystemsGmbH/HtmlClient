import { ContainerWrapperSpaceable, ContainerWrapper } from '.';
import { WrapContainer, WrapArrangement } from '../layout/wrap-layout';
import { ComponentRef, ViewContainerRef, ComponentFactoryResolver, ComponentFactory } from '@angular/core';
import { WrapPanelComponent } from '../controls';
import { HorizontalContentAlignment, VerticalContentAlignment } from '../enums';

export class WrapPanelWrapper extends ContainerWrapperSpaceable implements WrapContainer {

  protected getComponentRef(): ComponentRef<WrapPanelComponent> {
    return <ComponentRef<WrapPanelComponent>>super.getComponentRef();
  }

  protected getComponent(): WrapPanelComponent {
    return this.getComponentRef().instance;
  }

  public getViewContainerRef(): ViewContainerRef {
    return this.getComponent().anchor;
  }

  public getWrapArrangement(): WrapArrangement {
    return this.propertyStore.getWrapArrangement();
  }

  public getContentAlignmentHorizontal(): HorizontalContentAlignment {
    return this.propertyStore.getHorizontalContentAlignment();
  }

  public getContentAlignmentVertical(): VerticalContentAlignment {
    return this.propertyStore.getVerticalContentAlignment();
  }

  public attachComponent(container: ContainerWrapper): void {
    super.attachComponent(container);
    let cfr: ComponentFactoryResolver = this.appInjector.get(ComponentFactoryResolver);
    let factory: ComponentFactory<WrapPanelComponent> = cfr.resolveComponentFactory(WrapPanelComponent);
    let comp: ComponentRef<WrapPanelComponent> = container.getViewContainerRef().createComponent(factory);
    this.setComponentRef(comp);
    comp.instance.setWrapper(this);
  }

}

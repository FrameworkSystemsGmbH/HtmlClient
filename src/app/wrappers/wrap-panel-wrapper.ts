import { ContainerWrapperSpaceable, ContainerWrapper } from '.';
import { WrapContainer, WrapArrangement, WrapLayout } from '../layout/wrap-layout';
import { ComponentRef, ViewContainerRef, ComponentFactoryResolver, ComponentFactory } from '@angular/core';
import { WrapPanelComponent } from '../controls';
import { HorizontalContentAlignment, VerticalContentAlignment } from '../enums';
import { LayoutBase } from '../layout';

export class WrapPanelWrapper extends ContainerWrapperSpaceable implements WrapContainer {

  protected createLayout(): LayoutBase {
    return new WrapLayout(this);
  }

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
    let wrapArrangement: WrapArrangement = this.propertyStore.getWrapArrangement();
    return wrapArrangement != null ? wrapArrangement : WrapArrangement.Horizontal;
  }

  public getHorizontalContentAlignment(): HorizontalContentAlignment {
    let horizontalContentAlignment: HorizontalContentAlignment = this.propertyStore.getHorizontalContentAlignment();
    return horizontalContentAlignment != null ? horizontalContentAlignment : HorizontalContentAlignment.Left;
  }

  public getVerticalContentAlignment(): VerticalContentAlignment {
    let verticalContentAlignment: VerticalContentAlignment = this.propertyStore.getVerticalContentAlignment();
    return verticalContentAlignment != null ? verticalContentAlignment : VerticalContentAlignment.Top;
  }

  public createComponent(container: ContainerWrapper): void {
    let cfr: ComponentFactoryResolver = this.appInjector.get(ComponentFactoryResolver);
    let factory: ComponentFactory<WrapPanelComponent> = cfr.resolveComponentFactory(WrapPanelComponent);
    let comp: ComponentRef<WrapPanelComponent> = container.getViewContainerRef().createComponent(factory);
    let instance: WrapPanelComponent = comp.instance;

    this.setComponentRef(comp);
    instance.setWrapper(this);
    this.attachEvents(instance);
  }

}

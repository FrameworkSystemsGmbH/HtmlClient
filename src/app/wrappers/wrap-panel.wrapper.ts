import { ContainerWrapperSpaceable, ContainerWrapper } from '.';
import { WrapContainer, WrapArrangement, WrapLayout } from '../layout/wrap-layout';
import { ComponentRef, ViewContainerRef, ComponentFactoryResolver, ComponentFactory } from '@angular/core';
import { WrapPanelComponent } from '../controls';
import { HorizontalContentAlignment, VerticalContentAlignment } from '../enums';
import { LayoutBase } from '../layout';

export class WrapPanelWrapper extends ContainerWrapperSpaceable implements WrapContainer {

  public getLayout(): WrapLayout {
    return super.getLayout() as WrapLayout;
  }

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
    return this.propertyStore.getWrapArrangement();
  }

  public getContentAlignmentHorizontal(): HorizontalContentAlignment {
    return this.propertyStore.getHorizontalContentAlignment();
  }

  public getContentAlignmentVertical(): VerticalContentAlignment {
    return this.propertyStore.getVerticalContentAlignment();
  }

  public createComponent(container: ContainerWrapper): void {
    let cfr: ComponentFactoryResolver = this.appInjector.get(ComponentFactoryResolver);
    let factory: ComponentFactory<WrapPanelComponent> = cfr.resolveComponentFactory(WrapPanelComponent);
    let comp: ComponentRef<WrapPanelComponent> = container.getViewContainerRef().createComponent(factory);
    this.setComponentRef(comp);
    comp.instance.setWrapper(this);
  }

}
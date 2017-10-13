import { ComponentRef, ViewContainerRef, ComponentFactory } from '@angular/core';

import { ContainerWrapper } from './container-wrapper';
import { ContainerWrapperSpaceable } from './container-wrapper-spaceable';
import { WrapContainer, WrapArrangement, WrapLayout } from '../layout/wrap-layout';
import { WrapPanelComponent } from '../controls/wrap-panel/wrap-panel.component';
import { HorizontalContentAlignment, VerticalContentAlignment } from '../enums';
import { LayoutBase } from '../layout';

export class WrapPanelWrapper extends ContainerWrapperSpaceable implements WrapContainer {

  protected createLayout(): LayoutBase {
    return new WrapLayout(this);
  }

  protected getComponentRef(): ComponentRef<WrapPanelComponent> {
    return super.getComponentRef() as ComponentRef<WrapPanelComponent>;
  }

  protected getComponent(): WrapPanelComponent {
    let compRef: ComponentRef<WrapPanelComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
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
    const factory: ComponentFactory<WrapPanelComponent> = this.componentFactoryResolver.resolveComponentFactory(WrapPanelComponent);
    const comp: ComponentRef<WrapPanelComponent> = container.getViewContainerRef().createComponent(factory);
    const instance: WrapPanelComponent = comp.instance;

    this.setComponentRef(comp);
    instance.setWrapper(this);
    this.attachEvents(instance);
  }

}

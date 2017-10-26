import { ComponentRef, ViewContainerRef, ComponentFactory } from '@angular/core';

import { ContainerWrapper } from './container-wrapper';
import { ContainerWrapperSpaceable } from './container-wrapper-spaceable';
import { IWrapContainer } from '../layout/wrap-layout/wrap-container';
import { WrapArrangement } from '../layout/wrap-layout/wrap-arrangement';
import { WrapLayout } from '../layout/wrap-layout/wrap-layout';
import { WrapPanelComponent } from '../controls/wrap-panel/wrap-panel.component';
import { HorizontalContentAlignment } from '../enums/horizontal-content-alignment';
import { VerticalContentAlignment } from '../enums/vertical-content-alignment';
import { LayoutBase } from '../layout/layout-base';

export class WrapPanelWrapper extends ContainerWrapperSpaceable implements IWrapContainer {

  protected createLayout(): LayoutBase {
    return new WrapLayout(this);
  }

  protected getComponentRef(): ComponentRef<WrapPanelComponent> {
    return super.getComponentRef() as ComponentRef<WrapPanelComponent>;
  }

  protected getComponent(): WrapPanelComponent {
    const compRef: ComponentRef<WrapPanelComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  public getViewContainerRef(): ViewContainerRef {
    return this.getComponent().anchor;
  }

  public getWrapArrangement(): WrapArrangement {
    const wrapArrangement: WrapArrangement = this.propertyStore.getWrapArrangement();
    return wrapArrangement != null ? wrapArrangement : WrapArrangement.Horizontal;
  }

  public getHorizontalContentAlignment(): HorizontalContentAlignment {
    const horizontalContentAlignment: HorizontalContentAlignment = this.propertyStore.getHorizontalContentAlignment();
    return horizontalContentAlignment != null ? horizontalContentAlignment : HorizontalContentAlignment.Left;
  }

  public getVerticalContentAlignment(): VerticalContentAlignment {
    const verticalContentAlignment: VerticalContentAlignment = this.propertyStore.getVerticalContentAlignment();
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

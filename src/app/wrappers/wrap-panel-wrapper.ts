import { ComponentRef, ViewContainerRef, ComponentFactory } from '@angular/core';

import { IWrapContainer } from 'app/layout/wrap-layout/wrap-container.interface';
import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';

import { WrapPanelComponent } from 'app/controls/layouts/wrap-panel/wrap-panel.component';
import { ContainerWrapperSpaceable } from 'app/wrappers/container-wrapper-spaceable';
import { LayoutBase } from 'app/layout/layout-base';
import { WrapLayout } from 'app/layout/wrap-layout/wrap-layout';
import { WrapArrangement } from 'app/layout/wrap-layout/wrap-arrangement';
import { HorizontalContentAlignment } from 'app/enums/horizontal-content-alignment';
import { VerticalContentAlignment } from 'app/enums/vertical-content-alignment';
import { ControlType } from 'app/enums/control-type';

export class WrapPanelWrapper extends ContainerWrapperSpaceable implements IWrapContainer {

  public supportsButtonGroup(): boolean {
    return true;
  }

  public getControlType(): ControlType {
    return ControlType.WrapPanel;
  }

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
    const wrapArrangement: WrapArrangement = this.getPropertyStore().getWrapArrangement();
    return wrapArrangement != null ? wrapArrangement : WrapArrangement.Horizontal;
  }

  public getHorizontalContentAlignment(): HorizontalContentAlignment {
    const horizontalContentAlignment: HorizontalContentAlignment = this.getPropertyStore().getHorizontalContentAlignment();
    return horizontalContentAlignment != null ? horizontalContentAlignment : HorizontalContentAlignment.Left;
  }

  public getVerticalContentAlignment(): VerticalContentAlignment {
    const verticalContentAlignment: VerticalContentAlignment = this.getPropertyStore().getVerticalContentAlignment();
    return verticalContentAlignment != null ? verticalContentAlignment : VerticalContentAlignment.Top;
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<WrapPanelComponent> {
    const factory: ComponentFactory<WrapPanelComponent> = this.getResolver().resolveComponentFactory(WrapPanelComponent);
    return factory.create(container.getViewContainerRef().injector);
  }
}

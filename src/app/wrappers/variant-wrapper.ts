import { ComponentRef, ViewContainerRef, ComponentFactory } from '@angular/core';

import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';

import { ContainerWrapper } from './container-wrapper';
import { VariantComponent } from '../controls/variant/variant.component';
import { ControlEvent } from '../enums/control-event';

export class VariantWrapper extends ContainerWrapper {

  public getTitle(): string {
    return this.getPropertyStore().getTitle();
  }

  public getIsCloseIconVisible(): boolean {
    const isCloseIconVisible: boolean = this.getPropertyStore().getIsCloseIconVisible();
    return isCloseIconVisible != null ? isCloseIconVisible : false;
  }

  public isCloseEventAttached(): boolean {
    return (this.getEvents() & ControlEvent.OnClose) === ControlEvent.OnClose;
  }

  protected getComponentRef(): ComponentRef<VariantComponent> {
    return super.getComponentRef() as ComponentRef<VariantComponent>;
  }

  protected getComponent(): VariantComponent {
    const compRef: ComponentRef<VariantComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  public getViewContainerRef(): ViewContainerRef {
    return this.getComponent().anchor;
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<VariantComponent> {
    const factory: ComponentFactory<VariantComponent> = this.getResolver().resolveComponentFactory(VariantComponent);
    return factory.create(container.getViewContainerRef().injector);
  }
}

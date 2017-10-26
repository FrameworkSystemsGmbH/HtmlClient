import { ComponentRef, ViewContainerRef, ComponentFactory } from '@angular/core';

import { ContainerWrapper } from './container-wrapper';
import { VariantComponent } from '../controls/variant/variant.component';
import { ControlEvent } from '../enums/control-event';

export class VariantWrapper extends ContainerWrapper {

  public getTitle(): string {
    return this.propertyStore.getTitle();
  }

  public getIsCloseIconVisible(): boolean {
    const isCloseIconVisible: boolean = this.propertyStore.getIsCloseIconVisible();
    return isCloseIconVisible != null ? isCloseIconVisible : false;
  }

  public isCloseEventAttached(): boolean {
    return (this.events & ControlEvent.OnClose) === ControlEvent.OnClose;
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

  public createComponent(container: ContainerWrapper): void {
    const factory: ComponentFactory<VariantComponent> = this.componentFactoryResolver.resolveComponentFactory(VariantComponent);
    const comp: ComponentRef<VariantComponent> = container.getViewContainerRef().createComponent(factory);
    const instance: VariantComponent = comp.instance;

    this.setComponentRef(comp);
    instance.setWrapper(this);
    this.attachEvents(instance);
  }
}

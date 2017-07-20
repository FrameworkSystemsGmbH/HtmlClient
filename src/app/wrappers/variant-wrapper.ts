import { ComponentRef, ViewContainerRef, ComponentFactoryResolver, ComponentFactory } from '@angular/core';

import { ContainerWrapper } from '.';
import { VariantComponent } from '../controls';

export class VariantWrapper extends ContainerWrapper {

  protected getComponentRef(): ComponentRef<VariantComponent> {
    return super.getComponentRef() as ComponentRef<VariantComponent>;
  }

  protected getComponent(): VariantComponent {
    let compRef: ComponentRef<VariantComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  public getViewContainerRef(): ViewContainerRef {
    return this.getComponent().anchor;
  }

  public createComponent(container: ContainerWrapper): void {
    let cfr: ComponentFactoryResolver = this.appInjector.get(ComponentFactoryResolver);
    let factory: ComponentFactory<VariantComponent> = cfr.resolveComponentFactory(VariantComponent);
    let comp: ComponentRef<VariantComponent> = container.getViewContainerRef().createComponent(factory);
    let instance: VariantComponent = comp.instance;

    this.setComponentRef(comp);
    instance.setWrapper(this);
    this.attachEvents(instance);
  }
}

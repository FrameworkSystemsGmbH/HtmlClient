import { ComponentRef, ComponentFactoryResolver, ComponentFactory } from '@angular/core';

import { ContainerWrapper } from './container-wrapper';
import { ButtonBaseWrapper } from './button-base-wrapper';
import { ButtonPlainComponent } from '../controls';

export class ButtonPlainWrapper extends ButtonBaseWrapper {

  protected getComponentRef(): ComponentRef<ButtonPlainComponent> {
    return super.getComponentRef() as ComponentRef<ButtonPlainComponent>;
  }

  protected getComponent(): ButtonPlainComponent {
    let compRef: ComponentRef<ButtonPlainComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  public createComponent(container: ContainerWrapper): void {
    let cfr: ComponentFactoryResolver = this.appInjector.get(ComponentFactoryResolver);
    let factory: ComponentFactory<ButtonPlainComponent> = cfr.resolveComponentFactory(ButtonPlainComponent);
    let comp: ComponentRef<ButtonPlainComponent> = container.getViewContainerRef().createComponent(factory);
    let instance: ButtonPlainComponent = comp.instance;

    this.setComponentRef(comp);
    instance.setWrapper(this);
    this.attachEvents(instance);
  }
}

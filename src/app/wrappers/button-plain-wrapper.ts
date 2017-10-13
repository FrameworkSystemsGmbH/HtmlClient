import { ComponentRef, ComponentFactory } from '@angular/core';

import { ContainerWrapper } from './container-wrapper';
import { ButtonBaseWrapper } from './button-base-wrapper';
import { ButtonPlainComponent } from '../controls/button-plain/button-plain.component';

export class ButtonPlainWrapper extends ButtonBaseWrapper {

  protected getComponentRef(): ComponentRef<ButtonPlainComponent> {
    return super.getComponentRef() as ComponentRef<ButtonPlainComponent>;
  }

  protected getComponent(): ButtonPlainComponent {
    let compRef: ComponentRef<ButtonPlainComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  public createComponent(container: ContainerWrapper): void {
    const factory: ComponentFactory<ButtonPlainComponent> = this.componentFactoryResolver.resolveComponentFactory(ButtonPlainComponent);
    const comp: ComponentRef<ButtonPlainComponent> = container.getViewContainerRef().createComponent(factory);
    const instance: ButtonPlainComponent = comp.instance;

    this.setComponentRef(comp);
    instance.setWrapper(this);
    this.attachEvents(instance);
  }
}

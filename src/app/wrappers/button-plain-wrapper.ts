import { ComponentRef, ComponentFactory } from '@angular/core';

import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';

import { ButtonBaseWrapper } from 'app/wrappers/button-base-wrapper';
import { ButtonPlainComponent } from 'app/controls/button-plain/button-plain.component';

export class ButtonPlainWrapper extends ButtonBaseWrapper {

  protected getComponentRef(): ComponentRef<ButtonPlainComponent> {
    return super.getComponentRef() as ComponentRef<ButtonPlainComponent>;
  }

  protected getComponent(): ButtonPlainComponent {
    const compRef: ComponentRef<ButtonPlainComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<ButtonPlainComponent> {
    const factory: ComponentFactory<ButtonPlainComponent> = this.getResolver().resolveComponentFactory(ButtonPlainComponent);
    return factory.create(container.getViewContainerRef().injector);
  }
}

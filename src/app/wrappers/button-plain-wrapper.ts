import { ComponentRef, ComponentFactory } from '@angular/core';

import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';

import { ButtonBaseWrapper } from 'app/wrappers/button-base-wrapper';
import { ButtonPlainComponent } from 'app/controls/button-plain/button-plain.component';
import { ControlType } from 'app/enums/control-type';

export class ButtonPlainWrapper extends ButtonBaseWrapper {

  public getControlType(): ControlType {
    return ControlType.Button;
  }

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

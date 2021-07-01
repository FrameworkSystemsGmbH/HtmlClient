import { ComponentFactory, ComponentRef } from '@angular/core';
import { ButtonPlainComponent } from '@app/controls/buttons/button-plain/button-plain.component';
import { ControlType } from '@app/enums/control-type';
import { ButtonBaseWrapper } from '@app/wrappers/button-base-wrapper';
import { ILayoutableContainerWrapper } from '@app/wrappers/layout/layoutable-container-wrapper.interface';

export class ButtonPlainWrapper extends ButtonBaseWrapper {

  public getControlType(): ControlType {
    return ControlType.Button;
  }

  protected getComponentRef(): ComponentRef<ButtonPlainComponent> | null {
    return super.getComponentRef() as ComponentRef<ButtonPlainComponent> | null;
  }

  protected getComponent(): ButtonPlainComponent | null {
    const compRef: ComponentRef<ButtonPlainComponent> | null = this.getComponentRef();
    return compRef ? compRef.instance : null;
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<ButtonPlainComponent> {
    const factory: ComponentFactory<ButtonPlainComponent> = this.getResolver().resolveComponentFactory(ButtonPlainComponent);
    return factory.create(container.getViewContainerRef().injector);
  }
}

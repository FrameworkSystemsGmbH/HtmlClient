import { ComponentRef, ViewContainerRef, ComponentFactoryResolver, ComponentFactory } from '@angular/core';

import { TextBoxBaseWrapper, ContainerWrapper } from '.';
import { TextBoxNumberComponent } from '../controls';
import { ControlEvent, TextAlign } from '../enums';

export class TextBoxNumberWrapper extends TextBoxBaseWrapper {

  protected value: string;
  protected orgValue: string;

  public getValue(): string {
    return this.value;
  }

  public setValue(value: string): void {
    this.value = value;
  }

  protected getValueJson(): string {
    return this.getValue().toString();
  }

  protected setValueJson(value: string): void {
    this.setValue(value);
  }

  protected hasChanges(): boolean {
    return this.value !== this.orgValue;
  }

  public getComponentRef(): ComponentRef<TextBoxNumberComponent> {
    return <ComponentRef<TextBoxNumberComponent>>super.getComponentRef();
  }

  protected getComponent(): TextBoxNumberComponent {
    return this.getComponentRef().instance;
  }

  public createComponent(container: ContainerWrapper): void {
    let cfr: ComponentFactoryResolver = this.appInjector.get(ComponentFactoryResolver);
    let factory: ComponentFactory<TextBoxNumberComponent> = cfr.resolveComponentFactory(TextBoxNumberComponent);
    let comp: ComponentRef<TextBoxNumberComponent> = container.getViewContainerRef().createComponent(factory);
    this.setComponentRef(comp);
    comp.instance.setWrapper(this);
  }

}

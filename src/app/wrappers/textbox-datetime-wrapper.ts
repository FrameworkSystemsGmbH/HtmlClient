import { ComponentRef, ViewContainerRef, ComponentFactoryResolver, ComponentFactory } from '@angular/core';

import { TextBoxBaseWrapper, ContainerWrapper } from '.';
import { TextBoxDateTimeComponent } from '../controls';
import { ControlEvent, TextAlign } from '../enums';

export class TextBoxDateTimeWrapper extends TextBoxBaseWrapper {

  protected value: number;
  protected orgValue: number;

  public getValue(): number {
    return this.value;
  }

  public setValue(value: number): void {
    this.value = value;
  }

  public formatValue(): void {

  }

  protected getValueJson(): string {
    return this.getValue().toString();
  }

  protected setValueJson(value: string): void {
    this.setValue(Date.parse(value));
  }

  protected hasChanges(): boolean {
    return this.value !== this.orgValue;
  }

  public getComponentRef(): ComponentRef<TextBoxDateTimeComponent> {
    return <ComponentRef<TextBoxDateTimeComponent>>super.getComponentRef();
  }

  protected getComponent(): TextBoxDateTimeComponent {
    return this.getComponentRef().instance;
  }

  public createComponent(container: ContainerWrapper): void {
    let cfr: ComponentFactoryResolver = this.appInjector.get(ComponentFactoryResolver);
    let factory: ComponentFactory<TextBoxDateTimeComponent> = cfr.resolveComponentFactory(TextBoxDateTimeComponent);
    let comp: ComponentRef<TextBoxDateTimeComponent> = container.getViewContainerRef().createComponent(factory);
    let instance: TextBoxDateTimeComponent = comp.instance;

    this.setComponentRef(comp);
    instance.setWrapper(this);
    this.attachEvents(instance);
  }

}

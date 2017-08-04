import { ComponentRef, ComponentFactoryResolver, ComponentFactory } from '@angular/core';

import { TextBoxBaseWrapper, ContainerWrapper } from '.';
import { TextBoxNumberComponent } from '../controls';

export class TextBoxNumberWrapper extends TextBoxBaseWrapper {

  protected value: number;
  protected orgValue: number;

  public getValue(): number {
    return this.value;
  }

  public setValue(value: number): void {
    this.value = value;
  }

  protected getValueJson(): string {
    return this.value == null ? String.empty() : this.value.toString();
  }

  protected setValueJson(value: string): void {
    let val: number = null;

    if (!String.isNullOrWhiteSpace(value)) {
      val = parseFloat(value);

      if (val === NaN) {
        val = null;
      }
    }

    this.orgValue = val;
    this.setValue(val);
  }

  protected hasChanges(): boolean {
    return this.value !== this.orgValue;
  }

  protected getComponentRef(): ComponentRef<TextBoxNumberComponent> {
    return super.getComponentRef() as ComponentRef<TextBoxNumberComponent>;
  }

  protected getComponent(): TextBoxNumberComponent {
    let compRef: ComponentRef<TextBoxNumberComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  public createComponent(container: ContainerWrapper): void {
    let cfr: ComponentFactoryResolver = this.appInjector.get(ComponentFactoryResolver);
    let factory: ComponentFactory<TextBoxNumberComponent> = cfr.resolveComponentFactory(TextBoxNumberComponent);
    let comp: ComponentRef<TextBoxNumberComponent> = container.getViewContainerRef().createComponent(factory);
    let instance: TextBoxNumberComponent = comp.instance;

    this.setComponentRef(comp);
    instance.setWrapper(this);
    this.attachEvents(instance);
  }

}

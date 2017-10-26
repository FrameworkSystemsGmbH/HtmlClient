import { ComponentRef, ComponentFactory } from '@angular/core';

import { ContainerWrapper } from './container-wrapper';
import { TextBoxBaseWrapper } from './textbox-base-wrapper';
import { TextBoxNumberComponent } from '../controls/textbox-number/textbox-number.component';

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

      if (isNaN(val)) {
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
    const compRef: ComponentRef<TextBoxNumberComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  public createComponent(container: ContainerWrapper): void {
    const factory: ComponentFactory<TextBoxNumberComponent> = this.componentFactoryResolver.resolveComponentFactory(TextBoxNumberComponent);
    const comp: ComponentRef<TextBoxNumberComponent> = container.getViewContainerRef().createComponent(factory);
    const instance: TextBoxNumberComponent = comp.instance;

    this.setComponentRef(comp);
    instance.setWrapper(this);
    this.attachEvents(instance);
  }

}

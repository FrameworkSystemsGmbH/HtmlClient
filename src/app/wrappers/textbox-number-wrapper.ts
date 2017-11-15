import { ComponentRef, ComponentFactory } from '@angular/core';

import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';

import { TextBoxNumberComponent } from '../controls/textbox-number/textbox-number.component';
import { TextBoxBaseWrapper } from './textbox-base-wrapper';

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

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<TextBoxNumberComponent> {
    const factory: ComponentFactory<TextBoxNumberComponent> = this.getResolver().resolveComponentFactory(TextBoxNumberComponent);
    return factory.create(container.getViewContainerRef().injector);
  }
}

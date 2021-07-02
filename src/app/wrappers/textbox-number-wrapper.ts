import { ComponentFactory, ComponentRef } from '@angular/core';
import { TextBoxNumberComponent } from '@app/controls/textboxes/textbox-number/textbox-number.component';
import { TextBoxType } from '@app/enums/textbox-type';
import { ILayoutableContainerWrapper } from '@app/wrappers/layout/layoutable-container-wrapper.interface';
import { TextBoxBaseWrapper } from '@app/wrappers/textbox-base-wrapper';

export class TextBoxNumberWrapper extends TextBoxBaseWrapper {

  protected value: number | null = null;
  protected orgValue: number | null = null;

  public getTextBoxType(): TextBoxType {
    return TextBoxType.Number;
  }

  public getValue(): number | null {
    return this.value;
  }

  public setValue(value: number | null): void {
    this.value = value;
  }

  protected getValueJson(): string {
    return this.value == null ? String.empty() : this.value.toString();
  }

  protected setValueJson(value: string | null): void {
    let val: number | null = null;

    if (value != null && value.trim().length) {
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

  protected getComponentRef(): ComponentRef<TextBoxNumberComponent> | null {
    return super.getComponentRef() as ComponentRef<TextBoxNumberComponent> | null;
  }

  protected getComponent(): TextBoxNumberComponent | null {
    const compRef: ComponentRef<TextBoxNumberComponent> | null = this.getComponentRef();
    return compRef ? compRef.instance : null;
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<TextBoxNumberComponent> {
    const factory: ComponentFactory<TextBoxNumberComponent> = this.getResolver().resolveComponentFactory(TextBoxNumberComponent);
    return factory.create(container.getViewContainerRef().injector);
  }
}

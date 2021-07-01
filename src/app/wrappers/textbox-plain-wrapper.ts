import { ComponentFactory, ComponentRef } from '@angular/core';
import { TextBoxPlainComponent } from '@app/controls/textboxes/textbox-plain/textbox-plain.component';
import { TextBoxType } from '@app/enums/textbox-type';
import { ILayoutableContainerWrapper } from '@app/wrappers/layout/layoutable-container-wrapper.interface';
import { TextBoxBaseWrapper } from '@app/wrappers/textbox-base-wrapper';

export class TextBoxPlainWrapper extends TextBoxBaseWrapper {

  protected value: string | null = null;
  protected orgValue: string | null = null;

  public getTextBoxType(): TextBoxType {
    return TextBoxType.Plain;
  }

  public isPasswordField(): boolean {
    const pwChar: string | undefined = this.getPropertyStore().getPasswordChar();
    return pwChar != null && pwChar.trim().length > 0;
  }

  public getValue(): string | null {
    return this.value;
  }

  public setValue(value: string | null): void {
    this.value = value;
  }

  protected getValueJson(): string {
    return this.value == null ? String.empty() : this.value;
  }

  protected setValueJson(value: string): void {
    let val: string = value != null ? value : String.empty();
    val = this.getStringFormatService().formatString(val, this.getFormat());
    this.orgValue = val;
    this.setValue(val);
  }

  protected hasChanges(): boolean {
    return this.value !== this.orgValue;
  }

  protected getComponentRef(): ComponentRef<TextBoxPlainComponent> {
    return super.getComponentRef() as ComponentRef<TextBoxPlainComponent>;
  }

  protected getComponent(): TextBoxPlainComponent | null {
    const compRef: ComponentRef<TextBoxPlainComponent> | null = this.getComponentRef();
    return compRef ? compRef.instance : null;
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<TextBoxPlainComponent> {
    const factory: ComponentFactory<TextBoxPlainComponent> = this.getResolver().resolveComponentFactory(TextBoxPlainComponent);
    return factory.create(container.getViewContainerRef().injector);
  }
}

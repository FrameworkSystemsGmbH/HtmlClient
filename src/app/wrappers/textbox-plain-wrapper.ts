import { ComponentRef, ComponentFactory } from '@angular/core';

import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';

import { StringFormatService } from 'app/services/formatter/string-format.service';
import { TextBoxPlainComponent } from 'app/controls/textbox-plain/textbox-plain.component';
import { TextBoxBaseWrapper } from 'app/wrappers/textbox-base-wrapper';
import { TextBoxType } from 'app/enums/textbox-type';

export class TextBoxPlainWrapper extends TextBoxBaseWrapper {

  private stringFormatService: StringFormatService;

  protected value: string;
  protected orgValue: string;

  protected init(): void {
    super.init();
    this.stringFormatService = this.getInjector().get(StringFormatService);
  }

  public getTextBoxType(): TextBoxType {
    return TextBoxType.Plain;
  }

  protected getStringFormatService(): StringFormatService {
    return this.stringFormatService;
  }

  public getValue(): string {
    return this.value;
  }

  public setValue(value: string): void {
    this.value = value;
  }

  protected getValueJson(): string {
    return this.value == null ? String.empty() : encodeURIComponent(this.value);
  }

  protected setValueJson(value: string): void {
    let val: string = value != null ? decodeURIComponent(value) : String.empty();
    val = this.stringFormatService.formatString(val, this.getFormat());
    this.orgValue = val;
    this.setValue(val);
  }

  protected hasChanges(): boolean {
    return this.value !== this.orgValue;
  }

  protected getComponentRef(): ComponentRef<TextBoxPlainComponent> {
    return super.getComponentRef() as ComponentRef<TextBoxPlainComponent>;
  }

  protected getComponent(): TextBoxPlainComponent {
    const compRef: ComponentRef<TextBoxPlainComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<TextBoxPlainComponent> {
    const factory: ComponentFactory<TextBoxPlainComponent> = this.getResolver().resolveComponentFactory(TextBoxPlainComponent);
    return factory.create(container.getViewContainerRef().injector);
  }
}

import { ComponentRef, ComponentFactoryResolver, ComponentFactory, Injector } from '@angular/core';

import { FormWrapper } from './form-wrapper';
import { ContainerWrapper } from './container-wrapper';
import { TextBoxBaseWrapper } from './textbox-base-wrapper';
import { TextBoxPlainComponent } from '../controls/textbox-plain/textbox-plain.component';
import { PropertyData } from '../common';
import { StringFormatService } from '../services/formatter/string-format.service';
import { EventsService } from '../services/events.service';
import { FontService } from '../services/font.service';
import { PatternFormatService } from '../services/formatter/pattern-format.service';

export class TextBoxPlainWrapper extends TextBoxBaseWrapper {

  private stringFormatService: StringFormatService;

  protected value: string;
  protected orgValue: string;

  constructor(
    form: FormWrapper,
    parent: ContainerWrapper,
    controlStyle: PropertyData,
    injector: Injector
  ) {
    super(form, parent, controlStyle, injector);
    this.stringFormatService = injector.get(StringFormatService);
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
    let val: string = value ? decodeURIComponent(value) : null;
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
    let compRef: ComponentRef<TextBoxPlainComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  public createComponent(container: ContainerWrapper): void {
    const factory: ComponentFactory<TextBoxPlainComponent> = this.resolver.resolveComponentFactory(TextBoxPlainComponent);
    const comp: ComponentRef<TextBoxPlainComponent> = container.getViewContainerRef().createComponent(factory);
    const instance: TextBoxPlainComponent = comp.instance;

    this.setComponentRef(comp);
    instance.setWrapper(this);
    this.attachEvents(instance);
  }
}

import { ComponentRef, ComponentFactory, ComponentFactoryResolver } from '@angular/core';

import { IEventsService } from '../services/events.service';
import { IFocusService } from '../services/focus.service';
import { IFontService } from '../services/font.service';
import { IPatternFormatService } from '../services/formatter/pattern-format.service';
import { IStringFormatService } from '../services/formatter/string-format.service';

import { FormWrapper } from './form-wrapper';
import { ContainerWrapper } from './container-wrapper';
import { TextBoxBaseWrapper } from './textbox-base-wrapper';
import { TextBoxPlainComponent } from '../controls/textbox-plain/textbox-plain.component';
import { PropertyData } from '../common/property-data';

export class TextBoxPlainWrapper extends TextBoxBaseWrapper {

  private stringFormatService: IStringFormatService;

  protected value: string;
  protected orgValue: string;

  constructor(
    form: FormWrapper,
    parent: ContainerWrapper,
    controlStyle: PropertyData,
    resolver: ComponentFactoryResolver,
    eventsService: IEventsService,
    focusService: IFocusService,
    fontService: IFontService,
    patternFormatService: IPatternFormatService,
    stringFormatService: IStringFormatService
  ) {
    super(form, parent, controlStyle, resolver, eventsService, focusService, fontService, patternFormatService);
    this.stringFormatService = stringFormatService;
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
    const factory: ComponentFactory<TextBoxPlainComponent> = this.componentFactoryResolver.resolveComponentFactory(TextBoxPlainComponent);
    const comp: ComponentRef<TextBoxPlainComponent> = container.getViewContainerRef().createComponent(factory);
    const instance: TextBoxPlainComponent = comp.instance;

    this.setComponentRef(comp);
    instance.setWrapper(this);
    this.attachEvents(instance);
  }
}

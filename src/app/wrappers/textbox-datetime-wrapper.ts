import { ComponentRef, ComponentFactoryResolver, ComponentFactory, Injector } from '@angular/core';
import * as Moment from 'moment';

import { TextBoxBaseWrapper, ContainerWrapper, FormWrapper } from '.';
import { TextBoxDateTimeComponent } from '../controls';
import { DateFormatService } from '../services/formatter/date-format.service';

export class TextBoxDateTimeWrapper extends TextBoxBaseWrapper {

  private dateFormatService: DateFormatService;

  protected value: Moment.Moment;
  protected orgValue: Moment.Moment;

  constructor(
    form: FormWrapper,
    parent: ContainerWrapper,
    appInjector: Injector
  ) {
    super(form, parent, appInjector);
    this.dateFormatService = appInjector.get(DateFormatService);
  }

  public getValue(): Moment.Moment {
    return this.value;
  }

  public setValue(value: Moment.Moment): void {
    this.value = value;
  }

  protected getValueJson(): string {
    return this.value == null ? String.empty() : this.dateFormatService.momentToJson(this.value);
  }

  protected setValueJson(value: string): void {
    let val: Moment.Moment = null;

    if (!String.isNullOrWhiteSpace(value)) {
      val = this.dateFormatService.momentFromJson(value);

      if (val === null || !val.isValid()) {
        val = null;
      }
    }

    this.orgValue = val;
    this.setValue(val);
  }

  protected hasChanges(): boolean {
    return this.value !== this.orgValue;
  }

  protected getComponentRef(): ComponentRef<TextBoxDateTimeComponent> {
    return super.getComponentRef() as ComponentRef<TextBoxDateTimeComponent>;
  }

  protected getComponent(): TextBoxDateTimeComponent {
    let compRef: ComponentRef<TextBoxDateTimeComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
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

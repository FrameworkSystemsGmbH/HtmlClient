import { ComponentRef, ComponentFactory, Injector } from '@angular/core';
import * as Moment from 'moment-timezone';

import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';

import { DateTimeFormatService } from 'app/services/formatter/datetime-format.service';
import { TextBoxDateTimeComponent } from 'app/controls/textbox-datetime/textbox-datetime.component';
import { TextBoxBaseWrapper } from 'app/wrappers/textbox-base-wrapper';
import { ContainerWrapper } from 'app/wrappers/container-wrapper';
import { FormWrapper } from 'app/wrappers/form-wrapper';
import { PropertyData } from 'app/common/property-data';

export class TextBoxDateTimeWrapper extends TextBoxBaseWrapper {

  private readonly dateTimeFormatService: DateTimeFormatService;

  protected value: Moment.Moment;
  protected orgValue: Moment.Moment;

  constructor(
    injector: Injector,
    form: FormWrapper,
    parent: ContainerWrapper,
    controlStyle: PropertyData
  ) {
    super(injector, form, parent, controlStyle);
    this.dateTimeFormatService = injector.get(DateTimeFormatService);
  }

  protected getDateTimeFormatService(): DateTimeFormatService {
    return this.dateTimeFormatService;
  }

  public getValue(): Moment.Moment {
    return this.value;
  }

  public setValue(value: Moment.Moment): void {
    this.value = value;
  }

  protected getValueJson(): string {
    return this.value == null ? String.empty() : this.dateTimeFormatService.momentToJson(this.value);
  }

  protected setValueJson(value: string): void {
    let val: Moment.Moment = null;

    if (!String.isNullOrWhiteSpace(value)) {
      val = this.dateTimeFormatService.momentFromJson(value);

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
    const compRef: ComponentRef<TextBoxDateTimeComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<TextBoxDateTimeComponent> {
    const factory: ComponentFactory<TextBoxDateTimeComponent> = this.getResolver().resolveComponentFactory(TextBoxDateTimeComponent);
    return factory.create(container.getViewContainerRef().injector);
  }
}

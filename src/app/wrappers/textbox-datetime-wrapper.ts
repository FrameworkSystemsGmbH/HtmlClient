import { ComponentRef, ComponentFactory, ComponentFactoryResolver } from '@angular/core';
import * as Moment from 'moment-timezone';

import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';
import { IEventsService } from '../services/events.service';
import { IControlsService } from 'app/services/controls.service';
import { IFocusService } from '../services/focus.service';
import { IFontService } from '../services/font.service';
import { IPatternFormatService } from '../services/formatter/pattern-format.service';
import { IDateTimeFormatService } from '../services/formatter/datetime-format.service';

import { FormWrapper } from './form-wrapper';
import { ContainerWrapper } from './container-wrapper';
import { TextBoxBaseWrapper } from './textbox-base-wrapper';
import { TextBoxDateTimeComponent } from '../controls/textbox-datetime/textbox-datetime.component';
import { PropertyData } from '../common/property-data';

export class TextBoxDateTimeWrapper extends TextBoxBaseWrapper {

  private dateTimeFormatService: IDateTimeFormatService;

  protected value: Moment.Moment;
  protected orgValue: Moment.Moment;

  constructor(
    form: FormWrapper,
    parent: ContainerWrapper,
    controlStyle: PropertyData,
    resolver: ComponentFactoryResolver,
    controlsService: IControlsService,
    eventsService: IEventsService,
    focusService: IFocusService,
    fontService: IFontService,
    patternFormatService: IPatternFormatService,
    dateTimeFormatService: IDateTimeFormatService
  ) {
    super(form, parent, controlStyle, resolver, controlsService, eventsService, focusService, fontService, patternFormatService);
    this.dateTimeFormatService = dateTimeFormatService;
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

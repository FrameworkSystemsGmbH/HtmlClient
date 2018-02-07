import { ComponentRef, ComponentFactory, ComponentFactoryResolver } from '@angular/core';
import * as Moment from 'moment-timezone';

import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';
import { IEventsService } from 'app/services/events.service';
import { IControlsService } from 'app/services/controls.service';
import { IFocusService } from 'app/services/focus.service';
import { IPlatformService } from 'app/services/platform.service';
import { IFontService } from 'app/services/font.service';
import { IPatternFormatService } from 'app/services/formatter/pattern-format.service';
import { IDateTimeFormatService } from 'app/services/formatter/datetime-format.service';

import { TextBoxDateTimeComponent } from 'app/controls/textbox-datetime/textbox-datetime.component';
import { TextBoxBaseWrapper } from 'app/wrappers/textbox-base-wrapper';
import { ContainerWrapper } from 'app/wrappers/container-wrapper';
import { FormWrapper } from 'app/wrappers/form-wrapper';
import { PropertyData } from 'app/common/property-data';

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
    platformService: IPlatformService,
    fontService: IFontService,
    patternFormatService: IPatternFormatService,
    dateTimeFormatService: IDateTimeFormatService
  ) {
    super(form, parent, controlStyle, resolver, controlsService, eventsService, focusService, platformService, fontService, patternFormatService);
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

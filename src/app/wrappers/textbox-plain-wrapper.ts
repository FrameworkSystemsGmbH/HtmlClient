import { ComponentRef, ComponentFactory, ComponentFactoryResolver } from '@angular/core';

import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';
import { IEventsService } from 'app/services/events.service';
import { IControlsService } from 'app/services/controls.service';
import { IFocusService } from 'app/services/focus.service';
import { IPlatformService } from 'app/services/platform.service';
import { IFontService } from 'app/services/font.service';
import { IPatternFormatService } from 'app/services/formatter/pattern-format.service';
import { IStringFormatService } from 'app/services/formatter/string-format.service';

import { TextBoxPlainComponent } from 'app/controls/textbox-plain/textbox-plain.component';
import { TextBoxBaseWrapper } from 'app/wrappers/textbox-base-wrapper';
import { ContainerWrapper } from 'app/wrappers/container-wrapper';
import { FormWrapper } from 'app/wrappers/form-wrapper';
import { PropertyData } from 'app/common/property-data';

export class TextBoxPlainWrapper extends TextBoxBaseWrapper {

  private stringFormatService: IStringFormatService;

  protected value: string;
  protected orgValue: string;

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
    stringFormatService: IStringFormatService
  ) {
    super(form, parent, controlStyle, resolver, controlsService, eventsService, focusService, platformService, fontService, patternFormatService);
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

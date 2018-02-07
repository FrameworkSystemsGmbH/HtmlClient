import { Injectable, ComponentFactoryResolver } from '@angular/core';

import { IControlLabelProvider } from 'app/wrappers/control-labels/control-label-provider.interface';

import { ControlType } from 'app/enums/control-type';
import { ControlLabelTemplate } from 'app/wrappers/control-labels/control-label-template';
import { TextFormat } from 'app/enums/text-format';
import { PropertyStore } from 'app/common/property-store';
import { PropertyLayer } from 'app/common/property-layer';
import { PropertyData } from 'app/common/property-data';

import { ControlStyleService } from 'app/services/control-style.service';
import { EventsService } from 'app/services/events.service';
import { FocusService } from 'app/services/focus.service';
import { PlatformService } from 'app/services/platform.service';
import { FontService } from 'app/services/font.service';
import { ImageService } from 'app/services/image.service';
import { PatternFormatService } from 'app/services/formatter/pattern-format.service';
import { DateTimeFormatService } from 'app/services/formatter/datetime-format.service';
import { StringFormatService } from 'app/services/formatter/string-format.service';

import { ControlWrapper } from 'app/wrappers/control-wrapper';
import { ControlLabelWrapper } from 'app/wrappers/control-labels/control-label-wrapper';
import { ControlLabelSeparatorWrapper } from 'app/wrappers/control-labels/control-label-separator-wrapper';
import { ControlLabelContainerWrapper } from 'app/wrappers/control-labels/control-label-container-wrapper';
import { ControlLabelContainerMergedWrapper } from 'app/wrappers/control-labels/control-label-container-merged-wrapper';
import { ButtonImageWrapper } from 'app/wrappers/button-image-wrapper';
import { ButtonPlainWrapper } from 'app/wrappers/button-plain-wrapper';
import { ComboBoxWrapper } from 'app/wrappers/combobox-wrapper';
import { ContainerWrapper } from 'app/wrappers/container-wrapper';
import { DockPanelWrapper } from 'app/wrappers/dock-panel-wrapper';
import { FormWrapper } from 'app/wrappers/form-wrapper';
import { LabelWrapper } from 'app/wrappers/label-wrapper';
import { TextBoxBaseWrapper } from 'app/wrappers/textbox-base-wrapper';
import { TextBoxNumberWrapper } from 'app/wrappers/textbox-number-wrapper';
import { TextBoxDateTimeWrapper } from 'app/wrappers/textbox-datetime-wrapper';
import { TextBoxPlainWrapper } from 'app/wrappers/textbox-plain-wrapper';
import { VariantWrapper } from 'app/wrappers/variant-wrapper';
import { WrapPanelWrapper } from 'app/wrappers/wrap-panel-wrapper';
import { FieldPanelWrapper } from 'app/wrappers/field-panel-wrapper';
import { FieldRowWrapper } from 'app/wrappers/field-row-wrapper';

export interface IControlsService {
  createControlLabelWrapper(wrapper: IControlLabelProvider): ControlLabelWrapper;

  createControlLabelSeparatorWrapper(labelProvider: IControlLabelProvider): ControlLabelSeparatorWrapper;

  createControlLabelContainerWrapper(
    labelWrapper: ControlLabelWrapper,
    rowLabelTemplate: ControlLabelTemplate
  ): ControlLabelContainerWrapper;

  createControlLabelContainerMergedWrapper(
    labelWrappers: Array<ControlLabelWrapper>,
    rowLabelTemplate: ControlLabelTemplate
  ): ControlLabelContainerMergedWrapper;

  createWrapperFromType(controlJson: any, form: FormWrapper, parent: ContainerWrapper): ControlWrapper;
}

@Injectable()
export class ControlsService implements IControlsService {

  constructor(
    private resolver: ComponentFactoryResolver,
    private controlStyleService: ControlStyleService,
    private eventsService: EventsService,
    private focusService: FocusService,
    private platformService: PlatformService,
    private fontService: FontService,
    private imageService: ImageService,
    private patternFormatService: PatternFormatService,
    private dateTimeFormatService: DateTimeFormatService,
    private stringFormatService: StringFormatService
  ) { }

  public createControlLabelWrapper(labelProvider: IControlLabelProvider): ControlLabelWrapper {
    return new ControlLabelWrapper(labelProvider, this.resolver, this.fontService);
  }

  public createControlLabelSeparatorWrapper(labelProvider: IControlLabelProvider): ControlLabelSeparatorWrapper {
    return new ControlLabelSeparatorWrapper(labelProvider, this.resolver, this.fontService);
  }

  public createControlLabelContainerWrapper(
    labelWrapper: ControlLabelWrapper,
    rowLabelTemplate: ControlLabelTemplate
  ): ControlLabelContainerWrapper {
    return new ControlLabelContainerWrapper(labelWrapper, this.resolver, rowLabelTemplate);
  }

  public createControlLabelContainerMergedWrapper(
    labelWrappers: Array<ControlLabelWrapper>,
    rowLabelTemplate: ControlLabelTemplate
  ): ControlLabelContainerMergedWrapper {
    return new ControlLabelContainerMergedWrapper(labelWrappers, this.resolver, this, rowLabelTemplate);
  }

  public createWrapperFromType(controlJson: any, form: FormWrapper, parent: ContainerWrapper): ControlWrapper {
    const controlType: ControlType = controlJson.meta.typeId;
    const controlStyleStr: string = controlJson.meta.style;
    const controlStyle: PropertyData = controlStyleStr ? this.controlStyleService.getControlStyle(controlStyleStr) : null;

    switch (controlType) {
      case ControlType.Button:
        return new ButtonPlainWrapper(
          form,
          parent,
          controlStyle,
          this.resolver,
          this,
          this.eventsService,
          this.focusService,
          this.platformService,
          this.fontService
        );
      case ControlType.ImageButton:
        return new ButtonImageWrapper(
          form,
          parent,
          controlStyle,
          this.resolver,
          this,
          this.eventsService,
          this.focusService,
          this.platformService,
          this.fontService,
          this.imageService);
      case ControlType.ComboBox:
        return new ComboBoxWrapper(
          form,
          parent,
          controlStyle,
          this.resolver,
          this,
          this.eventsService,
          this.focusService,
          this.platformService,
          this.fontService
        );
      case ControlType.DockPanel:
        return new DockPanelWrapper(
          form,
          parent,
          controlStyle,
          this.resolver,
          this,
          this.eventsService,
          this.focusService,
          this.platformService
        );
      case ControlType.FieldPanel:
        return new FieldPanelWrapper(
          form,
          parent,
          controlStyle,
          this.resolver,
          this,
          this.eventsService,
          this.focusService,
          this.platformService
        );
      case ControlType.FieldRow:
        return new FieldRowWrapper(
          form,
          parent,
          controlStyle,
          this.resolver,
          this,
          this.eventsService,
          this.focusService,
          this.platformService
        );
      case ControlType.Label:
        return new LabelWrapper(
          form,
          parent,
          controlStyle,
          this.resolver,
          this,
          this.eventsService,
          this.focusService,
          this.platformService,
          this.fontService
        );
      case ControlType.Form:
        return new FormWrapper(
          form,
          parent,
          controlStyle,
          this.resolver,
          this,
          this.eventsService,
          this.focusService,
          this.platformService
        );
      case ControlType.Variant:
        return new VariantWrapper(
          form,
          parent,
          controlStyle,
          this.resolver,
          this,
          this.eventsService,
          this.focusService,
          this.platformService
        );
      case ControlType.WrapPanel:
        return new WrapPanelWrapper(
          form,
          parent,
          controlStyle,
          this.resolver,
          this,
          this.eventsService,
          this.focusService,
          this.platformService
        );
      case ControlType.TextBox:
        return this.createTextBoxWrapper(controlJson, form, parent, controlStyle);
    }

    return null;
  }

  private createTextBoxWrapper(controlJson: any, form: FormWrapper, parent: ContainerWrapper, controlStyle: PropertyData): TextBoxBaseWrapper {
    const propertyStore: PropertyStore = this.createPropertyStore(controlJson);

    switch (propertyStore.getFormat()) {
      case TextFormat.Decimal:
      case TextFormat.Integer:
      case TextFormat.PositiveInteger:
      case TextFormat.NegativeInteger:
        return new TextBoxNumberWrapper(
          form,
          parent,
          controlStyle,
          this.resolver,
          this,
          this.eventsService,
          this.focusService,
          this.platformService,
          this.fontService,
          this.patternFormatService
        );
      case TextFormat.DateTimeShort:
      case TextFormat.DateTimeMedium:
      case TextFormat.DateTimeLong:
      case TextFormat.DateOnlyShort:
      case TextFormat.DateOnlyMedium:
      case TextFormat.DateOnlyLong:
      case TextFormat.TimeOnlyShort:
      case TextFormat.TimeOnlyMedium:
      case TextFormat.TimeOnlyLong:
        return new TextBoxDateTimeWrapper(
          form,
          parent,
          controlStyle,
          this.resolver,
          this,
          this.eventsService,
          this.focusService,
          this.platformService,
          this.fontService,
          this.patternFormatService,
          this.dateTimeFormatService
        );
      default:
        return new TextBoxPlainWrapper(
          form,
          parent,
          controlStyle,
          this.resolver,
          this,
          this.eventsService,
          this.focusService,
          this.platformService,
          this.fontService,
          this.patternFormatService,
          this.stringFormatService
        );
    }
  }

  private createPropertyStore(controlJson: any): PropertyStore {
    const controlStyle: string = controlJson.meta.style;
    const properties: PropertyData = controlJson.properties;
    const propertyStore: PropertyStore = new PropertyStore();

    if (properties) {
      propertyStore.setLayer(PropertyLayer.Control, properties);
    }

    if (controlStyle) {
      const style: PropertyData = this.controlStyleService.getControlStyle(controlStyle);
      if (style) {
        propertyStore.setLayer(PropertyLayer.ControlStyle, style);
      }
    }

    return propertyStore;
  }
}

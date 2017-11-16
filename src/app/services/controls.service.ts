import { Injectable, ComponentFactoryResolver } from '@angular/core';

import { ControlType } from '../enums/control-type';
import { TextFormat } from '../enums/text-format';
import { PropertyStore } from '../common/property-store';
import { PropertyLayer } from '../common/property-layer';
import { PropertyData } from '../common/property-data';

import { ControlStyleService } from './control-style.service';
import { EventsService } from './events.service';
import { FocusService } from './focus.service';
import { FontService } from './font.service';
import { ImageService } from './image.service';
import { PatternFormatService } from './formatter/pattern-format.service';
import { DateTimeFormatService } from './formatter/datetime-format.service';
import { StringFormatService } from './formatter/string-format.service';

import { ControlWrapper } from '../wrappers/control-wrapper';
import { ButtonImageWrapper } from '../wrappers/button-image-wrapper';
import { ButtonPlainWrapper } from '../wrappers/button-plain-wrapper';
import { ContainerWrapper } from '../wrappers/container-wrapper';
import { DockPanelWrapper } from '../wrappers/dock-panel-wrapper';
import { FormWrapper } from '../wrappers/form-wrapper';
import { LabelWrapper } from '../wrappers/label-wrapper';
import { TextBoxBaseWrapper } from '../wrappers/textbox-base-wrapper';
import { TextBoxNumberWrapper } from '../wrappers/textbox-number-wrapper';
import { TextBoxDateTimeWrapper } from '../wrappers/textbox-datetime-wrapper';
import { TextBoxPlainWrapper } from '../wrappers/textbox-plain-wrapper';
import { VariantWrapper } from '../wrappers/variant-wrapper';
import { WrapPanelWrapper } from '../wrappers/wrap-panel-wrapper';
import { FieldPanelWrapper } from 'app/wrappers/field-panel-wrapper';
import { FieldRowWrapper } from 'app/wrappers/field-row-wrapper';

export interface IControlsService {
  createWrapperFromType(controlJson: any, form: FormWrapper, parent: ContainerWrapper): ControlWrapper;
}

@Injectable()
export class ControlsService implements IControlsService {

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private controlStyleService: ControlStyleService,
    private eventsService: EventsService,
    private focusService: FocusService,
    private fontService: FontService,
    private imageService: ImageService,
    private patternFormatService: PatternFormatService,
    private dateTimeFormatService: DateTimeFormatService,
    private stringFormatService: StringFormatService
  ) { }

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
          this.componentFactoryResolver,
          this,
          this.eventsService,
          this.focusService,
          this.fontService
        );
      case ControlType.ImageButton:
        return new ButtonImageWrapper(
          form,
          parent,
          controlStyle,
          this.componentFactoryResolver,
          this,
          this.eventsService,
          this.focusService,
          this.fontService,
          this.imageService);
      case ControlType.DockPanel:
        return new DockPanelWrapper(
          form,
          parent,
          controlStyle,
          this.componentFactoryResolver,
          this,
          this.eventsService,
          this.focusService
        );
      case ControlType.FieldPanel:
        return new FieldPanelWrapper(
          form,
          parent,
          controlStyle,
          this.componentFactoryResolver,
          this,
          this.eventsService,
          this.focusService
        );
      case ControlType.FieldRow:
        return new FieldRowWrapper(
          form,
          parent,
          controlStyle,
          this.componentFactoryResolver,
          this,
          this.eventsService,
          this.focusService
        );
      case ControlType.Label:
        return new LabelWrapper(
          form,
          parent,
          controlStyle,
          this.componentFactoryResolver,
          this,
          this.eventsService,
          this.focusService,
          this.fontService
        );
      case ControlType.Form:
        return new FormWrapper(
          form,
          parent,
          controlStyle,
          this.componentFactoryResolver,
          this,
          this.eventsService,
          this.focusService
        );
      case ControlType.Variant:
        return new VariantWrapper(
          form,
          parent,
          controlStyle,
          this.componentFactoryResolver,
          this,
          this.eventsService,
          this.focusService
        );
      case ControlType.WrapPanel:
        return new WrapPanelWrapper(
          form,
          parent,
          controlStyle,
          this.componentFactoryResolver,
          this,
          this.eventsService,
          this.focusService
        );
      case ControlType.TextBox:
        return this.createTextBoxWrapper(controlJson, form, parent, controlStyle);
      default:
        break;
      // #warning Commented because of CustomControls
      // throw new Error('ControlType \'' + controlType + '\' not supported!');
    }
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
          this.componentFactoryResolver,
          this,
          this.eventsService,
          this.focusService,
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
          this.componentFactoryResolver,
          this,
          this.eventsService,
          this.focusService,
          this.fontService,
          this.patternFormatService,
          this.dateTimeFormatService
        );
      default:
        return new TextBoxPlainWrapper(
          form,
          parent,
          controlStyle,
          this.componentFactoryResolver,
          this,
          this.eventsService,
          this.focusService,
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

import { Injectable, Injector } from '@angular/core';

import { ControlStyleService } from 'app/services/control-style.service';

import { ControlType } from 'app/enums/control-type';
import { TextFormat } from 'app/enums/text-format';
import { TextBoxType } from 'app/enums/textbox-type';
import { PropertyStore } from 'app/common/property-store';
import { PropertyLayer } from 'app/common/property-layer';
import { PropertyData } from 'app/common/property-data';

import { ControlWrapper } from 'app/wrappers/control-wrapper';
import { ButtonImageWrapper } from 'app/wrappers/button-image-wrapper';
import { ButtonPlainWrapper } from 'app/wrappers/button-plain-wrapper';
import { CheckBoxWrapper } from 'app/wrappers/checkbox-wrapper';
import { ComboBoxWrapper } from 'app/wrappers/combobox-wrapper';
import { ContainerWrapper } from 'app/wrappers/container-wrapper';
import { DockPanelWrapper } from 'app/wrappers/dock-panel-wrapper';
import { FormWrapper } from 'app/wrappers/form-wrapper';
import { LabelWrapper } from 'app/wrappers/label-wrapper';
import { TextBoxNumberWrapper } from 'app/wrappers/textbox-number-wrapper';
import { TextBoxDateTimeWrapper } from 'app/wrappers/textbox-datetime-wrapper';
import { TextBoxMultilineWrapper } from '../wrappers/textbox-multiline-wrapper';
import { TextBoxPlainWrapper } from 'app/wrappers/textbox-plain-wrapper';
import { VariantWrapper } from 'app/wrappers/variant-wrapper';
import { WrapPanelWrapper } from 'app/wrappers/wrap-panel-wrapper';
import { FieldPanelWrapper } from 'app/wrappers/field-panel-wrapper';
import { FieldRowWrapper } from 'app/wrappers/field-row-wrapper';

export interface IWrapperCreationOptions {
  form?: FormWrapper;
  parent?: ContainerWrapper;
  controlStyle?: string;
  textBoxStyle?: TextBoxType;
  state?: any;
}

@Injectable()
export class ControlsService {

  constructor(
    private injector: Injector,
    private controlStyleService: ControlStyleService
  ) { }

  public createWrapperFromType(controlType: ControlType, options: IWrapperCreationOptions): ControlWrapper {
    switch (controlType) {
      case ControlType.Button:
        return new ButtonPlainWrapper(this.injector, options);
      case ControlType.ImageButton:
        return new ButtonImageWrapper(this.injector, options);
      case ControlType.CheckBox:
        return new CheckBoxWrapper(this.injector, options);
      case ControlType.ComboBox:
        return new ComboBoxWrapper(this.injector, options);
      case ControlType.DockPanel:
        return new DockPanelWrapper(this.injector, options);
      case ControlType.FieldPanel:
        return new FieldPanelWrapper(this.injector, options);
      case ControlType.FieldRow:
        return new FieldRowWrapper(this.injector, options);
      case ControlType.Label:
        return new LabelWrapper(this.injector, options);
      case ControlType.Form:
        return new FormWrapper(this.injector, options);
      case ControlType.Variant:
        return new VariantWrapper(this.injector, options);
      case ControlType.WrapPanel:
        return new WrapPanelWrapper(this.injector, options);
      case ControlType.TextBox:
        switch (options.textBoxStyle) {
          case TextBoxType.Number:
            return new TextBoxNumberWrapper(this.injector, options);
          case TextBoxType.Date:
            return new TextBoxDateTimeWrapper(this.injector, options);
          case TextBoxType.Multiline:
            return new TextBoxMultilineWrapper(this.injector, options);
          default:
            return new TextBoxPlainWrapper(this.injector, options);
        }
    }

    return null;
  }

  public getTextBoxTypeFromControlJson(controlJson: any): TextBoxType {
    const propertyStore: PropertyStore = this.createPropertyStoreFromControlJson(controlJson);

    if (propertyStore.getIsMultiline()) {
      return TextBoxType.Multiline;
    }

    switch (propertyStore.getFormat()) {
      case TextFormat.Decimal:
      case TextFormat.Integer:
      case TextFormat.PositiveInteger:
      case TextFormat.NegativeInteger:
      case TextFormat.UserDefined:
        return TextBoxType.Number;
      case TextFormat.DateTimeShort:
      case TextFormat.DateTimeMedium:
      case TextFormat.DateTimeLong:
      case TextFormat.DateOnlyShort:
      case TextFormat.DateOnlyMedium:
      case TextFormat.DateOnlyLong:
      case TextFormat.TimeOnlyShort:
      case TextFormat.TimeOnlyMedium:
      case TextFormat.TimeOnlyLong:
        return TextBoxType.Date;
      default:
        return TextBoxType.Plain;
    }
  }

  private createPropertyStoreFromControlJson(controlJson: any): PropertyStore {
    const propertyStore: PropertyStore = new PropertyStore();

    if (!controlJson) {
      return propertyStore;
    }

    const controlStyle: string = controlJson.meta.style;
    const properties: PropertyData = controlJson.properties;

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

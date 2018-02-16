import { Injectable, Injector } from '@angular/core';

import { ControlStyleService } from 'app/services/control-style.service';

import { ControlType } from 'app/enums/control-type';
import { TextFormat } from 'app/enums/text-format';
import { PropertyStore } from 'app/common/property-store';
import { PropertyLayer } from 'app/common/property-layer';
import { PropertyData } from 'app/common/property-data';

import { ControlWrapper } from 'app/wrappers/control-wrapper';
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

@Injectable()
export class ControlsService {

  private readonly controlStyleService: ControlStyleService;

  constructor(private injector: Injector) {
    this.controlStyleService = injector.get(ControlStyleService);
  }

  public createWrapperFromType(controlJson: any, form: FormWrapper, parent: ContainerWrapper): ControlWrapper {
    const controlType: ControlType = controlJson.meta.typeId;
    const controlStyleStr: string = controlJson.meta.style;
    const controlStyle: PropertyData = controlStyleStr ? this.controlStyleService.getControlStyle(controlStyleStr) : null;

    switch (controlType) {
      case ControlType.Button:
        return new ButtonPlainWrapper(this.injector, form, parent, controlStyle);
      case ControlType.ImageButton:
        return new ButtonImageWrapper(this.injector, form, parent, controlStyle);
      case ControlType.ComboBox:
        return new ComboBoxWrapper(this.injector, form, parent, controlStyle);
      case ControlType.DockPanel:
        return new DockPanelWrapper(this.injector, form, parent, controlStyle);
      case ControlType.FieldPanel:
        return new FieldPanelWrapper(this.injector, form, parent, controlStyle);
      case ControlType.FieldRow:
        return new FieldRowWrapper(this.injector, form, parent, controlStyle);
      case ControlType.Label:
        return new LabelWrapper(this.injector, form, parent, controlStyle);
      case ControlType.Form:
        return new FormWrapper(this.injector, form, parent, controlStyle);
      case ControlType.Variant:
        return new VariantWrapper(this.injector, form, parent, controlStyle);
      case ControlType.WrapPanel:
        return new WrapPanelWrapper(this.injector, form, parent, controlStyle);
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
        return new TextBoxNumberWrapper(this.injector, form, parent, controlStyle);
      case TextFormat.DateTimeShort:
      case TextFormat.DateTimeMedium:
      case TextFormat.DateTimeLong:
      case TextFormat.DateOnlyShort:
      case TextFormat.DateOnlyMedium:
      case TextFormat.DateOnlyLong:
      case TextFormat.TimeOnlyShort:
      case TextFormat.TimeOnlyMedium:
      case TextFormat.TimeOnlyLong:
        return new TextBoxDateTimeWrapper(this.injector, form, parent, controlStyle);
      default:
        return new TextBoxPlainWrapper(this.injector, form, parent, controlStyle);
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

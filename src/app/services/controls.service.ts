import { Injectable, Injector } from '@angular/core';

import { IControlLabelProvider } from 'app/wrappers/control-labels/control-label-provider.interface';

import { ControlType } from 'app/enums/control-type';
import { ControlLabelTemplate } from 'app/wrappers/control-labels/control-label-template';
import { TextFormat } from 'app/enums/text-format';
import { PropertyStore } from 'app/common/property-store';
import { PropertyLayer } from 'app/common/property-layer';
import { PropertyData } from 'app/common/property-data';

import { ControlStyleService } from 'app/services/control-style.service';

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

@Injectable()
export class ControlsService {

  private readonly controlStyleService: ControlStyleService;

  constructor(private injector: Injector) {
    this.controlStyleService = injector.get(ControlStyleService);
  }

  public createControlLabelWrapper(labelProvider: IControlLabelProvider): ControlLabelWrapper {
    return new ControlLabelWrapper(this.injector, labelProvider);
  }

  public createControlLabelSeparatorWrapper(labelProvider: IControlLabelProvider): ControlLabelSeparatorWrapper {
    return new ControlLabelSeparatorWrapper(this.injector, labelProvider);
  }

  public createControlLabelContainerWrapper(
    labelWrapper: ControlLabelWrapper,
    rowLabelTemplate: ControlLabelTemplate
  ): ControlLabelContainerWrapper {
    return new ControlLabelContainerWrapper(this.injector, labelWrapper, rowLabelTemplate);
  }

  public createControlLabelContainerMergedWrapper(
    labelWrappers: Array<ControlLabelWrapper>,
    rowLabelTemplate: ControlLabelTemplate
  ): ControlLabelContainerMergedWrapper {
    return new ControlLabelContainerMergedWrapper(this.injector, this, labelWrappers, rowLabelTemplate);
  }

  public createWrapperFromType(controlJson: any, form: FormWrapper, parent: ContainerWrapper): ControlWrapper {
    const controlType: ControlType = controlJson.meta.typeId;
    const controlStyleStr: string = controlJson.meta.style;
    const controlStyle: PropertyData = controlStyleStr ? this.controlStyleService.getControlStyle(controlStyleStr) : null;

    switch (controlType) {
      case ControlType.Button:
        return new ButtonPlainWrapper(this.injector, form, parent, controlStyle, this);
      case ControlType.ImageButton:
        return new ButtonImageWrapper(this.injector, form, parent, controlStyle, this);
      case ControlType.ComboBox:
        return new ComboBoxWrapper(this.injector, form, parent, controlStyle, this);
      case ControlType.DockPanel:
        return new DockPanelWrapper(this.injector, form, parent, controlStyle, this);
      case ControlType.FieldPanel:
        return new FieldPanelWrapper(this.injector, form, parent, controlStyle, this);
      case ControlType.FieldRow:
        return new FieldRowWrapper(this.injector, form, parent, controlStyle, this);
      case ControlType.Label:
        return new LabelWrapper(this.injector, form, parent, controlStyle, this);
      case ControlType.Form:
        return new FormWrapper(this.injector, form, parent, controlStyle, this);
      case ControlType.Variant:
        return new VariantWrapper(this.injector, form, parent, controlStyle, this);
      case ControlType.WrapPanel:
        return new WrapPanelWrapper(this.injector, form, parent, controlStyle, this);
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
        return new TextBoxNumberWrapper(this.injector, form, parent, controlStyle, this);
      case TextFormat.DateTimeShort:
      case TextFormat.DateTimeMedium:
      case TextFormat.DateTimeLong:
      case TextFormat.DateOnlyShort:
      case TextFormat.DateOnlyMedium:
      case TextFormat.DateOnlyLong:
      case TextFormat.TimeOnlyShort:
      case TextFormat.TimeOnlyMedium:
      case TextFormat.TimeOnlyLong:
        return new TextBoxDateTimeWrapper(this.injector, form, parent, controlStyle, this);
      default:
        return new TextBoxPlainWrapper(this.injector, form, parent, controlStyle, this);
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

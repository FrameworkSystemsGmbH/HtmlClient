import { Injectable, Injector } from '@angular/core';
import { PropertyData } from '@app/common/property-data';
import { PropertyLayer } from '@app/common/property-layer';
import { PropertyStore } from '@app/common/property-store';
import { ControlType } from '@app/enums/control-type';
import { TextFormat } from '@app/enums/text-format';
import { TextBoxType } from '@app/enums/textbox-type';
import { ControlStyleService } from '@app/services/control-style.service';
import { ButtonImageWrapper } from '@app/wrappers/button-image-wrapper';
import { ButtonPlainWrapper } from '@app/wrappers/button-plain-wrapper';
import { CheckBoxWrapper } from '@app/wrappers/checkbox-wrapper';
import { ComboBoxWrapper } from '@app/wrappers/combobox-wrapper';
import { ContainerWrapper } from '@app/wrappers/container-wrapper';
import { ControlWrapper } from '@app/wrappers/control-wrapper';
import { DockPanelWrapper } from '@app/wrappers/dock-panel-wrapper';
import { FieldPanelWrapper } from '@app/wrappers/field-panel-wrapper';
import { FieldRowWrapper } from '@app/wrappers/field-row-wrapper';
import { FormWrapper } from '@app/wrappers/form-wrapper';
import { LabelWrapper } from '@app/wrappers/label-wrapper';
import { ListViewWrapper } from '@app/wrappers/listview-wrapper';
import { PictureWrapper } from '@app/wrappers/picture-wrapper';
import { RadioButtonWrapper } from '@app/wrappers/radio-button-wrapper';
import { TabPageWrapper } from '@app/wrappers/tabbed-window/tab-page-wrapper';
import { TabbedWindowWrapper } from '@app/wrappers/tabbed-window/tabbed-window-wrapper';
import { TemplateControlWrapper } from '@app/wrappers/template-control-wrapper';
import { TextBoxDateTimeWrapper } from '@app/wrappers/textbox-datetime-wrapper';
import { TextBoxMultilineWrapper } from '@app/wrappers/textbox-multiline-wrapper';
import { TextBoxNumberWrapper } from '@app/wrappers/textbox-number-wrapper';
import { TextBoxPlainWrapper } from '@app/wrappers/textbox-plain-wrapper';
import { VariantWrapper } from '@app/wrappers/variant-wrapper';
import { WrapPanelWrapper } from '@app/wrappers/wrap-panel-wrapper';

export interface IWrapperCreationOptions {
  init: boolean;
  form?: FormWrapper;
  parent?: ContainerWrapper;
  controlStyle?: string;
  textBoxStyle?: TextBoxType;
}

/** Kann aus einem ControlType einen Wrapper bauen. Bekommt über json
 * mit, welches control es gibt und erstellt dafür den Wrapper.
 */
@Injectable({ providedIn: 'root' })
export class ControlsService {

  private readonly _injector: Injector;
  private readonly _controlStyleService: ControlStyleService;

  public constructor(
    injector: Injector,
    controlStyleService: ControlStyleService
  ) {
    this._injector = injector;
    this._controlStyleService = controlStyleService;
  }

  public createWrapperFromType(controlType: ControlType, options: IWrapperCreationOptions): ControlWrapper | null {
    switch (controlType) {
      case ControlType.Button:
        return new ButtonPlainWrapper(this._injector, options);
      case ControlType.ImageButton:
        return new ButtonImageWrapper(this._injector, options);
      case ControlType.CheckBox:
        return new CheckBoxWrapper(this._injector, options);
      case ControlType.RadioButton:
        return new RadioButtonWrapper(this._injector, options);
      case ControlType.ComboBox:
        return new ComboBoxWrapper(this._injector, options);
      case ControlType.DockPanel:
        return new DockPanelWrapper(this._injector, options);
      case ControlType.FieldPanel:
        return new FieldPanelWrapper(this._injector, options);
      case ControlType.FieldRow:
        return new FieldRowWrapper(this._injector, options);
      case ControlType.Label:
        return new LabelWrapper(this._injector, options);
      case ControlType.ListView:
        return new ListViewWrapper(this._injector, options);
      case ControlType.Picture:
        return new PictureWrapper(this._injector, options);
      case ControlType.Form:
        return new FormWrapper(this._injector, options);
      case ControlType.TemplateControl:
        return new TemplateControlWrapper(this._injector, options);
      case ControlType.Variant:
        return new VariantWrapper(this._injector, options);
      case ControlType.WrapPanel:
        return new WrapPanelWrapper(this._injector, options);
      case ControlType.TabbedWindow:
        return new TabbedWindowWrapper(this._injector, options);
      case ControlType.TabPage:
        return new TabPageWrapper(this._injector, options);
      case ControlType.TextBox:
        switch (options.textBoxStyle) {
          case TextBoxType.Number:
            return new TextBoxNumberWrapper(this._injector, options);
          case TextBoxType.Date:
            return new TextBoxDateTimeWrapper(this._injector, options);
          case TextBoxType.Multiline:
            return new TextBoxMultilineWrapper(this._injector, options);
          default:
            return new TextBoxPlainWrapper(this._injector, options);
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
    const properties: PropertyData | null = controlJson.properties;

    if (properties) {
      propertyStore.setLayer(PropertyLayer.Control, properties);
    }

    if (controlStyle) {
      const style: PropertyData | null = this._controlStyleService.getControlStyle(controlStyle);
      if (style != null) {
        propertyStore.setLayer(PropertyLayer.ControlStyle, style);
      }
    }

    return propertyStore;
  }
}

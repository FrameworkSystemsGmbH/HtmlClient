import { Injectable } from '@angular/core';

import { BaseWrapper } from '../wrappers/base-wrapper';
import { ContainerWrapper } from '../wrappers/container-wrapper';
import { FormWrapper } from '../wrappers/form-wrapper';
import { TextBoxBaseWrapper } from '../wrappers/textbox-base-wrapper';
import { ControlStyleService } from './control-style.service';
import { PropertyStore, PropertyData, PropertyLayer } from '../common';
import { ControlType, TextFormat } from '../enums';

import { ButtonImageWrapperFactory } from '../wrappers/factories/button-image-wrapper-factory';
import { ButtonPlainWrapperFactory } from '../wrappers/factories/button-plain-wrapper-factory';
import { DockPanelWrapperFactory } from '../wrappers/factories/dock-panel-wrapper-factory';
import { FormWrapperFactory } from '../wrappers/factories/form-wrapper-factory';
import { LabelWrapperFactory } from '../wrappers/factories/label-wrapper-factory';
import { TextBoxDateTimeWrapperFactory } from '../wrappers/factories/textbox-datetime-wrapper-factory';
import { TextBoxNumberWrapperFactory } from '../wrappers/factories/textbox-number-wrapper-factory';
import { TextBoxPlainWrapperFactory } from '../wrappers/factories/textbox-plain-wrapper-factory';
import { VariantWrapperFactory } from '../wrappers/factories/variant-wrapper-factory';
import { WrapPanelWrapperFactory } from '../wrappers/factories/wrap-panel-wrapper-factory';

@Injectable()
export class ControlsService {

  private scrollBarWidth: number;

  constructor(
    private controlStyleService: ControlStyleService,
    private buttonImageWrapperFactory: ButtonImageWrapperFactory,
    private buttonPlainWrapperFactory: ButtonPlainWrapperFactory,
    private dockPanelWrapperFactory: DockPanelWrapperFactory,
    private formWrapperFactory: FormWrapperFactory,
    private labelWrapperFactory: LabelWrapperFactory,
    private textBoxDateTimeWrapperFactory: TextBoxDateTimeWrapperFactory,
    private textBoxNumberWrapperFactory: TextBoxNumberWrapperFactory,
    private textBoxPlainWrapperFactory: TextBoxPlainWrapperFactory,
    private variantWrapperFactory: VariantWrapperFactory,
    private wrapPanelWrapperFactory: WrapPanelWrapperFactory) { }

  public createWrapperFromType(controlJson: any, form: FormWrapper, parent: ContainerWrapper): BaseWrapper {
    const controlType: ControlType = controlJson.meta.typeId;
    const controlStyleStr: string = controlJson.meta.style;
    const controlStyle: PropertyData = controlStyleStr ? this.controlStyleService.getControlStyle(controlStyleStr) : null;

    switch (controlType) {
      case ControlType.Button:
        return this.buttonPlainWrapperFactory.create(form, parent, controlStyle);
      case ControlType.ImageButton:
        return this.buttonImageWrapperFactory.create(form, parent, controlStyle);
      case ControlType.DockPanel:
        return this.dockPanelWrapperFactory.create(form, parent, controlStyle);
      case ControlType.Label:
        return this.labelWrapperFactory.create(form, parent, controlStyle);
      case ControlType.TextBox:
        return this.createTextBoxWrapper(controlJson, form, parent, controlStyle)
      case ControlType.Form:
        return this.formWrapperFactory.create(form, parent, controlStyle);
      case ControlType.Variant:
        return this.variantWrapperFactory.create(form, parent, controlStyle);
      case ControlType.WrapPanel:
        return this.wrapPanelWrapperFactory.create(form, parent, controlStyle);
      default:
      // #warning Commented because of CustomControls
      // throw new Error('ControlType \'' + controlType + '\' not supported!');
    }
  }

  private createTextBoxWrapper(controlJson: any, form: FormWrapper, parent: ContainerWrapper, controlStyle: PropertyData): TextBoxBaseWrapper {
    let propertyStore: PropertyStore = this.createPropertyStore(controlJson);

    switch (propertyStore.getFormat()) {
      case TextFormat.Decimal:
      case TextFormat.Integer:
      case TextFormat.PositiveInteger:
      case TextFormat.NegativeInteger:
        return this.textBoxNumberWrapperFactory.create(form, parent, controlStyle);
      case TextFormat.DateTimeShort:
      case TextFormat.DateTimeMedium:
      case TextFormat.DateTimeLong:
      case TextFormat.DateOnlyShort:
      case TextFormat.DateOnlyMedium:
      case TextFormat.DateOnlyLong:
      case TextFormat.TimeOnlyShort:
      case TextFormat.TimeOnlyMedium:
      case TextFormat.TimeOnlyLong:
        return this.textBoxDateTimeWrapperFactory.create(form, parent, controlStyle);
      default:
        return this.textBoxPlainWrapperFactory.create(form, parent, controlStyle);
    }
  }

  private createPropertyStore(controlJson: any): PropertyStore {
    let controlStyle: string = controlJson.meta.style;
    let properties: PropertyData = controlJson.properties;
    let propertyStore: PropertyStore = new PropertyStore();

    if (properties) {
      propertyStore.setLayer(PropertyLayer.Control, properties);
    }

    if (controlStyle) {
      let style: PropertyData = this.controlStyleService.getControlStyle(controlStyle);
      if (style) {
        propertyStore.setLayer(PropertyLayer.ControlStyle, style);
      }
    }

    return propertyStore;
  }

  public getScrollBarWidth(): number {
    if (this.scrollBarWidth == null) {
      let div: HTMLDivElement = document.createElement('div');
      div.className = 'scrollbar-measure';
      document.body.appendChild(div);
      this.scrollBarWidth = div.offsetWidth - div.clientWidth;
      document.body.removeChild(div);
    }

    return this.scrollBarWidth;
  }
}

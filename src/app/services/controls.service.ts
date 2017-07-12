import { ComponentFactoryResolver, ComponentRef, EventEmitter, Injectable, Injector, ViewContainerRef, ApplicationRef } from '@angular/core';
import { ISubscription } from 'rxjs/subscription';

import {
  BaseWrapper,
  ContainerWrapper,
  ButtonWrapper,
  DockPanelWrapper,
  FormWrapper,
  LabelWrapper,
  TextBoxPlainWrapper,
  WrapPanelWrapper,
  VariantWrapper,
  TextBoxBaseWrapper,
  TextBoxNumberWrapper,
  TextBoxDateTimeWrapper
} from '../wrappers';

import { ControlType, TextFormat } from '../enums';
import { PropertyStore, PropertyData, PropertyLayer } from '../common';
import { ControlStyleService } from './control-style.service';

@Injectable()
export class ControlsService {

  private scrollBarWidth: number;

  constructor(
    private appInjector: Injector,
    private controlStyleService: ControlStyleService
  ) { }

  public createWrapperFromType(controlJson: any, form: FormWrapper, parent: ContainerWrapper): BaseWrapper {
    let controlType: ControlType = controlJson.meta.typeId;

    switch (controlType) {
      case ControlType.Button:
        return new ButtonWrapper(form, parent, this.appInjector);
      case ControlType.DockPanel:
        return new DockPanelWrapper(form, parent, this.appInjector);
      case ControlType.Label:
        return new LabelWrapper(form, parent, this.appInjector);
      case ControlType.TextBox:
        return this.createTextBoxWrapper(controlJson, form, parent)
      case ControlType.Form:
        return new FormWrapper(form, parent, this.appInjector);
      case ControlType.Variant:
        return new VariantWrapper(form, parent, this.appInjector);
      case ControlType.WrapPanel:
        return new WrapPanelWrapper(form, parent, this.appInjector);
      default:
        throw new Error('ControlType \'' + controlType + '\' not supported!');
    }
  }

  private createTextBoxWrapper(controlJson: any, form: FormWrapper, parent: ContainerWrapper): TextBoxBaseWrapper {
    let propertyStore: PropertyStore = this.createPropertyStore(controlJson);

    switch (propertyStore.getFormat()) {
      case TextFormat.Decimal:
      case TextFormat.Integer:
      case TextFormat.PositiveInteger:
      case TextFormat.NegativeInteger:
        return new TextBoxNumberWrapper(form, parent, this.appInjector);
      case TextFormat.DateTimeShort:
      case TextFormat.DateTimeMedium:
      case TextFormat.DateTimeLong:
      case TextFormat.DateOnlyShort:
      case TextFormat.DateOnlyMedium:
      case TextFormat.DateOnlyLong:
      case TextFormat.TimeOnlyShort:
      case TextFormat.TimeOnlyMedium:
      case TextFormat.TimeOnlyLong:
        return new TextBoxDateTimeWrapper(form, parent, this.appInjector);
      default:
        return new TextBoxPlainWrapper(form, parent, this.appInjector);
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

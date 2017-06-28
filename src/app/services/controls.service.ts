import { ComponentFactoryResolver, ComponentRef, EventEmitter, Injectable, Injector, ViewContainerRef, ApplicationRef } from '@angular/core';
import { ISubscription } from 'rxjs/subscription';

import {
  BaseWrapper,
  ContainerWrapper,
  ButtonWrapper,
  DockPanelWrapper,
  FormWrapper,
  LabelWrapper,
  TextBoxWrapper,
  WrapPanelWrapper,
  VariantWrapper
} from '../wrappers';

import { ControlType } from '../enums';

@Injectable()
export class ControlsService {

  constructor(
    private appInjector: Injector
  ) { }

  public createWrapperFromType(controlType: ControlType, form: FormWrapper, parent: ContainerWrapper): BaseWrapper {
    switch (controlType) {
      case ControlType.Button:
        return new ButtonWrapper(form, parent, this.appInjector);
      case ControlType.DockPanel:
        return new DockPanelWrapper(form, parent, this.appInjector);
      case ControlType.Label:
        return new LabelWrapper(form, parent, this.appInjector);
      case ControlType.TextBox:
        return new TextBoxWrapper(form, parent, this.appInjector);
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
}

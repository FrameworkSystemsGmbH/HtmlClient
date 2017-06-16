import { ComponentFactoryResolver, ComponentRef, EventEmitter, Injectable, Injector, ViewContainerRef, ApplicationRef } from '@angular/core';
import { ISubscription } from 'rxjs/subscription';

import { ControlType } from '../enums';
import { JsonUtil } from '../util';
import {
  BaseWrapper,
  ContainerWrapper,
  ButtonWrapper,
  FormWrapper,
  LabelWrapper,
  TextBoxWrapper,
  WrapPanelWrapper
} from '../wrappers';
import { EventsService } from './events.service';
import { ControlStyleService } from './control-style.service';

@Injectable()
export class ControlsService {

  constructor(
    private appInjector: Injector
  ) { }

  public createWrapperFromString(controlTypeStr: string, form: FormWrapper, parent: ContainerWrapper): BaseWrapper {
    return this.createWrapperFromType(ControlType[controlTypeStr], form, parent);
  }

  public createWrapperFromType(controlType: ControlType, form: FormWrapper, parent: ContainerWrapper): BaseWrapper {
    switch (controlType) {
      case ControlType.Button:
        return new ButtonWrapper(form, parent, this.appInjector);
      case ControlType.Form:
        return new FormWrapper(form, parent, this.appInjector);
      case ControlType.Label:
        return new LabelWrapper(form, parent, this.appInjector);
      case ControlType.TextBox:
        return new TextBoxWrapper(form, parent, this.appInjector);
      case ControlType.WrapPanel:
        return new WrapPanelWrapper(form, parent, this.appInjector);
      default:
        throw new Error('ControlType \'' + controlType + '\' not supported!');
    }
  }
}

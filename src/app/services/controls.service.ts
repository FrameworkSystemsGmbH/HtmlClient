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
  TextBoxWrapper
} from '../wrappers';
import { EventsService } from './events.service';
import { ControlStyleService } from './control-style.service';

@Injectable()
export class ControlsService {

  constructor(
    private appInjector: Injector
  ) { }

  public createWrapperFromString(controlTypeStr: string, json: any, form: FormWrapper, parent: ContainerWrapper): BaseWrapper {
    return this.createWrapperFromType(ControlType[controlTypeStr], json, form, parent);
  }

  public createWrapperFromType(controlType: ControlType, json: any, form: FormWrapper, parent: ContainerWrapper): BaseWrapper {
    switch (controlType) {
      case ControlType.Button:
        return new ButtonWrapper(json, form, parent, this.appInjector);
      case ControlType.Form:
        return new FormWrapper(json, form, parent, this.appInjector);
      case ControlType.Label:
        return new LabelWrapper(json, form, parent, this.appInjector);
      case ControlType.TextBox:
        return new TextBoxWrapper(json, form, parent, this.appInjector);
      default:
        throw new Error('ControlType \'' + controlType + '\' not supported!');
    }
  }
}

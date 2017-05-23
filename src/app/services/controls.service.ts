import { ComponentFactoryResolver, ComponentRef, EventEmitter, Injectable, Injector, ViewContainerRef } from '@angular/core';
import { ISubscription } from 'rxjs/subscription';

import { EventsService } from '.';
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

@Injectable()
export class ControlsService {

  constructor(
    private eventsService: EventsService,
    private cfr: ComponentFactoryResolver
  ) { }

  public createWrapperFromString(controlTypeStr: string, form: FormWrapper, parent: ContainerWrapper, controlJson: any): BaseWrapper {
    return this.createWrapperFromType(ControlType[controlTypeStr], form, parent, controlJson);
  }

  public createWrapperFromType(controlType: ControlType, form: FormWrapper, parent: ContainerWrapper, controlJson: any): BaseWrapper {
    switch (controlType) {
      case ControlType.Button:
        return new ButtonWrapper(form, parent, controlJson, this.eventsService);
      case ControlType.Form:
        return new FormWrapper(form, parent, controlJson, this.eventsService, this);
      case ControlType.Label:
        return new LabelWrapper(form, parent, controlJson, this.eventsService);
      case ControlType.TextBox:
        return new TextBoxWrapper(form, parent, controlJson, this.eventsService);
      default:
        throw new Error('ControlType \'' + controlType + '\' not supported!');
    }
  }
}

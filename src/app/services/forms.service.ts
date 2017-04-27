import {
  ComponentFactoryResolver,
  ComponentRef,
  EventEmitter,
  Injectable,
  Injector,
  ViewContainerRef
} from '@angular/core';

import { ISubscription } from 'rxjs/subscription';

import { JsonUtil } from '../util';
import { ClientEventArgs } from '../models/eventargs/client.eventargs';
import { ControlType } from '../enums';
import { ControlsService } from './controls.service';

import {
  BaseWrapper,
  ButtonWrapper,
  FormWrapper,
  LabelWrapper,
  TextBoxWrapper
} from '../wrappers';

@Injectable()
export class FormsService {

  private forms: Array<FormWrapper> = new Array<FormWrapper>();

  constructor(private controlsService: ControlsService) { }

  public getFormsJson(eventArgs?: ClientEventArgs): any {
    let formsJson: any = [];

    this.forms.forEach((formWrp: FormWrapper) => {
      let formJson: any = formWrp.getJson();

      if (formJson && eventArgs) {
        formJson.event = eventArgs.getJson();
      } else if (eventArgs) {
        formJson = {
          meta: {
            name: formWrp.getName()
          },
          event: eventArgs.getJson()
        };
      }

      if (formJson) {
        formsJson.push(formJson);
      }
    });

    return formsJson;
  }

  public setFormsJson(vc: ViewContainerRef, formsJson: any) {
    formsJson.forEach((formJson: any) => {
      let delta: boolean = formJson.meta.delta;

      if (delta) {
        let formName: string = formJson.meta.name;
        let formWrps: Array<FormWrapper> = this.forms.filter((formWrp: FormWrapper) => formWrp.getName() === formName);

        if (formWrps && formWrps.length) {
          let form: FormWrapper = formWrps[0];
          form.setJson(formJson, true);
        }
      } else {
        let formWrp: FormWrapper = <FormWrapper>this.controlsService.createWrapperFromType(ControlType.Form, null, null, formJson);
        // formWrp.addViewToViewContainer(vc);
        this.forms.push(formWrp);
      }
    });
  }

  public findForm(formName: string): FormWrapper {
    for (let i = 0; i < this.forms.length; i++) {
      let form: FormWrapper = this.forms[i];
      if (form.getName() === formName) {
        return form;
      }
    }

    return null;
  }
}

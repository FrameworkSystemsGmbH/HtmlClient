import { ComponentFactoryResolver, ComponentRef, EventEmitter, Injectable, Injector, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ISubscription } from 'rxjs/Subscription';

import { ControlType } from '../enums';
import { ClientEventArgs } from '../common/eventargs';
import { JsonUtil } from '../util';

import {
  BaseWrapper,
  ButtonWrapper,
  FormWrapper,
  LabelWrapper,
  TextBoxWrapper
} from '../wrappers';

import { ResponseFormDto } from '../communication/response';
import { ControlsService } from './controls.service';

@Injectable()
export class FormsService {

  public formSelected: EventEmitter<FormWrapper>;

  private forms: Array<FormWrapper> = new Array<FormWrapper>();
  private selectedForm: FormWrapper;

  constructor(private controlsService: ControlsService) {
    this.formSelected = new EventEmitter<FormWrapper>();
  }

  public getForms(): Observable<Array<FormWrapper>> {
    return Observable.of(this.forms);
  }

  public getSelectedForm(): FormWrapper {
    return this.selectedForm;
  }

  public selectForm(form: FormWrapper): void {
    this.selectedForm = form;
    this.formSelected.emit(form);
  }

  public resetViews(): void {
    this.forms = new Array<FormWrapper>();
    this.selectedForm = null;
  }

  public fireSelectCurrentForm(): void {
    if (this.selectedForm) {
      this.selectForm(this.selectedForm);
    }
  }

  // public getFormsJson(eventArgs?: ClientEventArgs): any {
  //   let formsJson: any = [];

  //   this.forms.forEach((formWrp: FormWrapper) => {
  //     let formJson: any = formWrp.getJson();

  //     if (formJson && eventArgs) {
  //       formJson.event = eventArgs.getJson();
  //     } else if (eventArgs) {
  //       formJson = {
  //         meta: {
  //           name: formWrp.getName()
  //         },
  //         event: eventArgs.getJson()
  //       };
  //     }

  //     if (formJson) {
  //       formsJson.push(formJson);
  //     }
  //   });

  //   return formsJson;
  // }

  public setJson(fromsJson: any) {
    for (let formJson of fromsJson) {
      if (formJson.meta.new) {
        let formWrp: FormWrapper = <FormWrapper>this.controlsService.createWrapperFromType(ControlType.Form, null, null);
        formWrp.setJson(formJson, true);
        this.forms.push(formWrp);
        if (!this.selectedForm) {
          this.selectedForm = formWrp;
        }
      } else {
        let formId: number = formJson.meta.id;
        let formWrps: Array<FormWrapper> = this.forms.filter((formWrp: FormWrapper) => formWrp.getId() === formId);
        if (formWrps && formWrps.length) {
          let form: FormWrapper = formWrps[0];
          form.setJson(formJson, false);
        }
      }
    }
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

import { ComponentFactoryResolver, ComponentRef, EventEmitter, Injectable, Injector, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ISubscription } from 'rxjs/Subscription';

import { ControlType } from '../enums';
import { JsonUtil } from '../util';
import { FormWrapper } from '../wrappers';
import { ControlsService } from './controls.service';
import { ClientEvent } from '../common/events';
import { EventsService } from './events.service';

@Injectable()
export class FormsService {

  public formSelected: EventEmitter<FormWrapper>;

  private forms: Array<FormWrapper> = new Array<FormWrapper>();
  private selectedForm: FormWrapper;

  constructor(
    private controlsService: ControlsService,
    private eventsService: EventsService) {
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

  public closeForm(form: FormWrapper): void {
    let formId: string = form.getId();

    if (form.isCloseEventAttached()) {
      this.eventsService.fireClose(formId);
    }

    this.eventsService.fireDispose(formId);

    let index: number = this.forms.indexOf(form);

    this.forms.remove(form);

    if (form === this.selectedForm) {
      if (index < this.forms.length && index >= 0) {
        this.selectForm(this.forms[index]);
      } else if (this.forms.length) {
        this.selectForm(this.forms[0]);
      } else {
        this.selectForm(null);
      }
    }
  }

  public resetViews(): void {
    this.forms = new Array<FormWrapper>();
    this.selectForm(null);
  }

  public fireSelectCurrentForm(): void {
    this.selectForm(this.selectedForm ? this.selectedForm : null);
  }

  public getFormsJson(): any {
    let formsJson: Array<any> = new Array<any>();

    this.forms.forEach((formWrp: FormWrapper) => {
      let controlsJson: Array<any> = new Array<any>();

      formWrp.getControlsJson(controlsJson);

      if (controlsJson.length) {
        let formJson: any = formWrp.getMetaJson();
        formJson.controls = controlsJson;
        formsJson.push(formJson);
      }
    });

    return formsJson.length ? formsJson : null;
  }

  public setJson(fromsJson: any) {
    for (let formJson of fromsJson) {
      if (formJson.meta.new) {
        let form: FormWrapper = <FormWrapper>this.controlsService.createWrapperFromType({ meta: { typeId: ControlType.Form } }, null, null);
        form.setJson(formJson, true);
        this.forms.push(form);
        if (!this.selectedForm || formJson.meta.focused) {
          this.selectForm(form);
        }
      } else {
        let formId: string = formJson.meta.id;
        let formWrps: Array<FormWrapper> = this.forms.filter((formWrp: FormWrapper) => formWrp.getId() === formId);
        if (formWrps && formWrps.length) {
          let form: FormWrapper = formWrps[0];
          form.setJson(formJson, false);
          if (!this.selectedForm || formJson.meta.focused) {
            this.selectForm(form);
          }
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

import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ControlType } from '../enums/control-type';
import { FormWrapper } from '../wrappers/form-wrapper';
import { ControlsService } from './controls.service';
import { EventsService } from './events.service';
import { InternalEventCallbacks } from '../common/events/internal/internal-event-callbacks';
import { ClientCloseEvent } from '../common/events/client-close-event';
import { ClientDisposeEvent } from '../common/events/client-dispose-event';

@Injectable()
export class FormsService {

  public formSelected: EventEmitter<FormWrapper>;

  private forms: Array<FormWrapper> = [];
  private selectedForm: FormWrapper;

  constructor(
    private eventsService: EventsService,
    private controlsService: ControlsService) {
    this.formSelected = new EventEmitter<FormWrapper>();
  }

  public getForms(): Observable<Array<FormWrapper>> {
    return Observable.of(this.forms);
  }

  public selectForm(form: FormWrapper): void {
    this.selectedForm = form;
    this.formSelected.emit(form);
  }

  public closeForm(form: FormWrapper): void {
    const formId: string = form.getId();
    this.eventsService.fireClose(formId,
      new InternalEventCallbacks<ClientCloseEvent>(
        form.isCloseEventAttached.bind(form),
        null,
        this.getOnCloseCompletedCallback(formId, form).bind(this)
      )
    );
  }

  protected getOnCloseCompletedCallback(formId: string, form: FormWrapper): () => void {
    return () => {
      this.eventsService.fireDispose(formId,
        new InternalEventCallbacks<ClientDisposeEvent>(
          () => true,
          null,
          this.getOnDisposeCompletedCallback(form).bind(this)
        )
      );
    };
  }

  protected getOnDisposeCompletedCallback(form: FormWrapper): () => void {
    return () => {
      const index: number = this.forms.indexOf(form);
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
    };
  }

  public resetViews(): void {
    this.forms = new Array<FormWrapper>();
    this.selectForm(null);
  }

  public fireSelectCurrentForm(): void {
    this.selectForm(this.selectedForm ? this.selectedForm : null);
  }

  public getFormsJson(): any {
    const formsJson: Array<any> = [];

    this.forms.forEach((formWrp: FormWrapper) => {
      const controlsJson: Array<any> = [];

      formWrp.getControlsJson(controlsJson);

      if (controlsJson.length) {
        const formJson: any = formWrp.getMetaJson();
        formJson.controls = controlsJson;
        formsJson.push(formJson);
      }
    });

    return formsJson.length ? formsJson : null;
  }

  public setJson(fromsJson: any) {
    for (const formJson of fromsJson) {
      if (formJson.meta.new) {
        const form: FormWrapper = this.controlsService.createWrapperFromType({ meta: { typeId: ControlType.Form } }, null, null) as FormWrapper;
        form.setJson(formJson, true);
        this.forms.push(form);
        if (!this.selectedForm || formJson.meta.focused) {
          this.selectForm(form);
        }
      } else {
        const formId: string = formJson.meta.id;
        const formWrps: Array<FormWrapper> = this.forms.filter((formWrp: FormWrapper) => formWrp.getId() === formId);
        if (formWrps && formWrps.length) {
          const form: FormWrapper = formWrps[0];
          form.setJson(formJson, false);
          if (!this.selectedForm || formJson.meta.focused) {
            this.selectForm(form);
          }
        }
      }
    }
  }

  public findForm(formName: string): FormWrapper {
    for (const form of this.forms) {
      if (form.getName() === formName) {
        return form;
      }
    }

    return null;
  }
}

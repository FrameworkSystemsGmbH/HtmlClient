import { EventEmitter, Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { FormWrapper } from 'app/wrappers/form-wrapper';
import { ControlsService, IWrapperCreationOptions } from 'app/services/controls.service';
import { EventsService } from 'app/services/events.service';
import { InternalEventCallbacks } from 'app/common/events/internal/internal-event-callbacks';
import { ClientCloseEvent } from 'app/common/events/client-close-event';
import { ClientDisposeEvent } from 'app/common/events/client-dispose-event';
import { JsonUtil } from 'app/util/json-util';
import { ContainerWrapper } from 'app/wrappers/container-wrapper';
import { ControlWrapper } from 'app/wrappers/control-wrapper';
import { ControlType } from 'app/enums/control-type';

@Injectable()
export class FormsService {

  public formSelected: EventEmitter<FormWrapper>;

  private forms: Array<FormWrapper> = new Array<FormWrapper>();
  private selectedForm: FormWrapper;

  constructor(
    private injector: Injector,
    private eventsService: EventsService,
    private controlsService: ControlsService
  ) {
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

  public updateAllComponents(): void {
    this.forms.forEach(formWrp => {
      formWrp.updateComponentRecursively();
    });
  }

  public resetViews(): void {
    this.forms = new Array<FormWrapper>();
    this.selectForm(null);
  }

  public fireSelectCurrentForm(): void {
    this.selectForm(this.selectedForm ? this.selectedForm : null);
  }

  public getFormsJson(): any {
    const formsJson: Array<any> = new Array<any>();

    this.forms.forEach((formWrp: FormWrapper) => {
      const controlsJson: Array<any> = new Array<any>();

      formWrp.getControlsJson(controlsJson);

      if (!JsonUtil.isEmptyObject(controlsJson)) {
        const formJson: any = formWrp.getMetaJson();
        formJson.controls = controlsJson;
        formsJson.push(formJson);
      }
    });

    return !JsonUtil.isEmptyObject(formsJson) ? formsJson : null;
  }

  public setJson(fromsJson: any) {
    for (const formJson of fromsJson) {
      if (formJson.meta.new) {
        const form: FormWrapper = new FormWrapper(this.injector);
        form.setJson(formJson, true);

        if (formJson.controls && formJson.controls.length) {
          this.setControlsJson(form, formJson.controls, true);
        }

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

          if (formJson.controls && formJson.controls.length) {
            this.setControlsJson(form, formJson.controls, false);
          }

          if (formJson.meta.action === 'Close') {
            this.closeForm(form);
          } else {
            if (!this.selectedForm || formJson.meta.focused) {
              this.selectForm(form);
            }
          }
        }
      }
    }
  }

  protected setControlsJson(form: FormWrapper, controlsJson: any, isNew: boolean): void {
    for (const controlJson of controlsJson) {
      if (isNew) {
        let parent: ContainerWrapper = form;

        if (controlJson.meta.parentName) {
          parent = form.findControlRecursive(controlJson.meta.parentName) as ContainerWrapper;
        }

        const controlType: ControlType = controlJson.meta.typeId;
        const controlStyle: string = controlJson.meta.style;

        const options: IWrapperCreationOptions = {
          form,
          parent,
          controlStyle
        };

        if (controlType === ControlType.TextBox) {
          options.textBoxStyle = this.controlsService.getTextBoxTypeFromControlJson(controlJson);
        }

        const control: ControlWrapper = this.controlsService.createWrapperFromType(controlType, options);

        if (control) {
          control.setJson(controlJson, true);
        }
      } else {
        const control: ControlWrapper = form.findControlRecursive(controlJson.meta.name);

        if (control) {
          control.setJson(controlJson, false);
        }
      }
    }
  }

  public findFormById(id: string): FormWrapper {
    for (const form of this.forms) {
      if (form.getId() === id) {
        return form;
      }
    }
    return null;
  }

  public findFormByName(name: string): FormWrapper {
    for (const form of this.forms) {
      if (form.getName() === name) {
        return form;
      }
    }
    return null;
  }

  public getState(): any {
    const json: any = {
      selectedForm: this.selectedForm ? this.selectedForm.getId() : null
    };

    const forms: Array<any> = new Array<any>();

    this.forms.forEach(form => {
      forms.push(form.getState());
    });

    if (forms.length) {
      json.forms = forms;
    }

    return json;
  }

  public setState(json: any): void {
    if (json.forms) {
      json.forms.forEach(formJson => {
        const form: FormWrapper = new FormWrapper(this.injector, { state: formJson });

        if (formJson.controls && formJson.controls.length) {
          this.setControlsState(form, formJson.controls);
        }

        this.forms.push(form);
      });
    }

    if (json.selectedForm) {
      const form: FormWrapper = this.findFormById(json.selectedForm);
      if (form) {
        this.selectForm(form);
      }
    }
  }

  private setControlsState(form: FormWrapper, controlsJson: Array<any>): void {
    if (!controlsJson || !controlsJson.length) {
      return;
    }

    controlsJson.forEach(controlJson => {
      let parent: ContainerWrapper = form;

      if (controlJson.parent) {
        parent = form.findControlRecursive(controlJson.parent) as ContainerWrapper;
      }

      const controlType: ControlType = controlJson.controlType;

      const options: IWrapperCreationOptions = {
        form,
        parent,
        controlStyle: controlJson.controlStyle,
        state: controlJson
      };

      if (controlType === ControlType.TextBox) {
        options.textBoxStyle = controlJson.textBoxType;
      }

      this.controlsService.createWrapperFromType(controlType, options);
    });
  }
}

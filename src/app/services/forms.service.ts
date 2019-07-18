import { Injectable, Injector } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

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
import { ButtonBaseWrapper } from 'app/wrappers/button-base-wrapper';

@Injectable()
export class FormsService {

  private _forms: Array<FormWrapper> = new Array<FormWrapper>();

  private _forms$$: BehaviorSubject<Array<FormWrapper>>;
  private _forms$: Observable<Array<FormWrapper>>;

  private _selectedForm$$: BehaviorSubject<FormWrapper>;
  private _selectedForm$: Observable<FormWrapper>;

  private _lastOpenedForm: FormWrapper;

  constructor(
    private injector: Injector,
    private eventsService: EventsService,
    private controlsService: ControlsService
  ) {
    this._forms$$ = new BehaviorSubject<Array<FormWrapper>>(null);
    this._forms$ = this._forms$$.asObservable();

    this._selectedForm$$ = new BehaviorSubject<FormWrapper>(null);
    this._selectedForm$ = this._selectedForm$$.asObservable();
  }

  public getForms(): Observable<Array<FormWrapper>> {
    return this._forms$;
  }

  private fireFormsChanged(): void {
    this._forms$$.next(this._forms);
  }

  public selectForm(form: FormWrapper): void {
    this._lastOpenedForm = this._selectedForm$$.getValue();
    this._selectedForm$$.next(form);
  }

  public getSelectedForm(): Observable<FormWrapper> {
    return this._selectedForm$;
  }

  public closeFormByButton(form: FormWrapper): void {
    const closeButton: ButtonBaseWrapper = form.getCloseButton();

    if (closeButton) {
      closeButton.fireClick();
    } else {
      this.closeForm(form);
    }
  }

  public closeForm(form: FormWrapper): void {
    form.closing = true;
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
      const index: number = this._forms.indexOf(form);
      this._forms.remove(form);
      this.fireFormsChanged();

      if (form === this._selectedForm$$.getValue()) {
        let lastFound: boolean = false;
        if (this._lastOpenedForm) {
          const lastOpened: FormWrapper = this._forms.find(f => f.getId() === this._lastOpenedForm.getId());
          if (lastOpened) {
            lastFound = true;
            this.selectForm(lastOpened);
          }
        }

        if (!lastFound) {
          if (index < this._forms.length && index >= 0) {
            this.selectForm(this._forms[index]);
          } else if (this._forms.length) {
            this.selectForm(this._forms[this._forms.length - 1]);
          } else {
            this.selectForm(null);
          }
        }
      }
    };
  }

  public updateAllComponents(): void {
    this._forms.forEach(formWrp => {
      formWrp.updateComponentRecursively();
    });
  }

  public resetViews(): void {
    this._forms = new Array<FormWrapper>();
    this.fireFormsChanged();
    this.selectForm(null);
  }

  public fireSelectCurrentForm(): void {
    this.selectForm(this._selectedForm$$.getValue());
  }

  public getFormsJson(): any {
    const formsJson: Array<any> = new Array<any>();

    this._forms.forEach((formWrp: FormWrapper) => {
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

        this._forms.push(form);
        this.fireFormsChanged();

        if (!this._selectedForm$$.getValue() || formJson.meta.focused) {
          this.selectForm(form);
        }
      } else {
        const formId: string = formJson.meta.id;
        const formWrps: Array<FormWrapper> = this._forms.filter((formWrp: FormWrapper) => formWrp.getId() === formId);

        if (formWrps && formWrps.length) {
          const form: FormWrapper = formWrps[0];
          form.setJson(formJson, false);

          if (formJson.controls && formJson.controls.length) {
            this.setControlsJson(form, formJson.controls, false);
          }

          if (formJson.meta.action === 'Close' && !form.closing) {
            this.closeForm(form);
          } else {
            if (!this._selectedForm$$.getValue() || formJson.meta.focused) {
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
    for (const form of this._forms) {
      if (form.getId() === id) {
        return form;
      }
    }
    return null;
  }

  public findFormByName(name: string): FormWrapper {
    for (const form of this._forms) {
      if (form.getName() === name) {
        return form;
      }
    }
    return null;
  }

  public getState(): any {
    const selectedForm: FormWrapper = this._selectedForm$$.getValue();

    const json: any = {
      selectedForm: selectedForm ? selectedForm.getId() : null
    };

    const forms: Array<any> = new Array<any>();

    this._forms.forEach(form => {
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

        this._forms.push(form);
      });

      this.fireFormsChanged();
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

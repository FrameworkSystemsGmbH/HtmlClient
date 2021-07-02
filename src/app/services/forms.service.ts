import { Injectable, Injector } from '@angular/core';
import { InternalEventCallbacks } from '@app/common/events/internal/internal-event-callbacks';
import { ControlType } from '@app/enums/control-type';
import { MsgBoxButtons } from '@app/enums/msgbox-buttons';
import { MsgBoxIcon } from '@app/enums/msgbox-icon';
import { MsgBoxResult } from '@app/enums/msgbox-result';
import { ControlsService, IWrapperCreationOptions } from '@app/services/controls.service';
import { DialogService } from '@app/services/dialog.service';
import { EventsService } from '@app/services/events.service';
import { TitleService } from '@app/services/title.service';
import * as JsonUtil from '@app/util/json-util';
import { ButtonBaseWrapper } from '@app/wrappers/button-base-wrapper';
import { ContainerWrapper } from '@app/wrappers/container-wrapper';
import { ControlWrapper } from '@app/wrappers/control-wrapper';
import { FormWrapper } from '@app/wrappers/form-wrapper';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FormsService {

  private readonly _injector: Injector;
  private readonly _titleService: TitleService;
  private readonly _dialogService: DialogService;
  private readonly _eventsService: EventsService;
  private readonly _controlsService: ControlsService;

  private readonly _forms$$: BehaviorSubject<Array<FormWrapper> | null>;
  private readonly _forms$: Observable<Array<FormWrapper> | null>;

  private readonly _selectedForm$$: BehaviorSubject<FormWrapper | null>;
  private readonly _selectedForm$: Observable<FormWrapper | null>;

  private _forms: Array<FormWrapper> = new Array<FormWrapper>();

  private _lastOpenedForm: FormWrapper | null = null;

  public constructor(
    injector: Injector,
    titleService: TitleService,
    dialogService: DialogService,
    eventsService: EventsService,
    controlsService: ControlsService
  ) {
    this._injector = injector;
    this._titleService = titleService;
    this._dialogService = dialogService;
    this._eventsService = eventsService;
    this._controlsService = controlsService;

    this._forms$$ = new BehaviorSubject<Array<FormWrapper> | null>(null);
    this._forms$ = this._forms$$.asObservable();

    this._selectedForm$$ = new BehaviorSubject<FormWrapper | null>(null);
    this._selectedForm$ = this._selectedForm$$.asObservable();
  }

  public getForms(): Observable<Array<FormWrapper> | null> {
    return this._forms$;
  }

  private fireFormsChanged(): void {
    this._forms$$.next(this._forms);
  }

  public selectForm(form: FormWrapper | null): void {
    this._lastOpenedForm = this._selectedForm$$.getValue();
    this._selectedForm$$.next(form);
  }

  public getSelectedForm(): Observable<FormWrapper | null> {
    return this._selectedForm$;
  }

  public closeFormByButton(form: FormWrapper): void {
    const closeButton: ButtonBaseWrapper | null = form.getCloseButton();

    if (closeButton) {
      closeButton.fireClick();
    } else if (this.isLastOpenForm(form)) {
      this._dialogService.showMsgBoxBox({
        buttons: MsgBoxButtons.YesNo,
        icon: MsgBoxIcon.Question,
        message: 'Do you want to close the session?',
        title: this._titleService.getTitle()
      }).subscribe(result => {
        if (result === MsgBoxResult.Yes) {
          this.closeForm(form);
        }
      });
    } else {
      this.closeForm(form);
    }
  }

  public closeForm(form: FormWrapper): void {
    form.closing = true;
    const formId: string = form.getId();
    this._eventsService.fireClose(formId,
      new InternalEventCallbacks(
        form.isCloseEventAttached.bind(form),
        null,
        this.getOnCloseCompletedCallback(formId, form).bind(this)
      )
    );
  }

  private isLastOpenForm(form: FormWrapper): boolean {
    return this._forms.length === 1 && this._forms[0] === form;
  }

  protected getOnCloseCompletedCallback(formId: string, form: FormWrapper): () => void {
    return (): void => {
      this._eventsService.fireDispose(formId,
        new InternalEventCallbacks(
          () => true,
          null,
          this.getOnDisposeCompletedCallback(form).bind(this)
        )
      );
    };
  }

  protected getOnDisposeCompletedCallback(form: FormWrapper): () => void {
    return (): void => {
      const index: number = this._forms.indexOf(form);
      this._forms.remove(form);
      this.fireFormsChanged();

      if (form === this._selectedForm$$.getValue()) {
        let lastFound: boolean = false;
        if (this._lastOpenedForm) {
          const lastOpened: FormWrapper | undefined = this._forms.find(f => {
            if (this._lastOpenedForm) {
              return f.getId() === this._lastOpenedForm.getId();
            } else {
              return false;
            }
          });
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

      this.checkEmptyApp();
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

  public checkEmptyApp(): void {
    if (this._forms.length === 0) {
      this._eventsService.fireApplicationQuit(false);
    }
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

    return !JsonUtil.isEmptyObject(formsJson) ? formsJson as any : null;
  }

  public setJson(fromsJson: any): void {
    for (const formJson of fromsJson) {
      if (formJson.meta.new) {
        const form: FormWrapper = new FormWrapper(this._injector);
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

        if (formWrps.length) {
          const form: FormWrapper = formWrps[0];
          form.setJson(formJson, false);

          if (formJson.controls && formJson.controls.length) {
            this.setControlsJson(form, formJson.controls, false);
          }

          if (formJson.meta.action === 'Close' && !form.closing) {
            this.closeForm(form);
          } else if (!this._selectedForm$$.getValue() || formJson.meta.focused) {
            this.selectForm(form);
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
          options.textBoxStyle = this._controlsService.getTextBoxTypeFromControlJson(controlJson);
        }

        const control: ControlWrapper | null = this._controlsService.createWrapperFromType(controlType, options);

        if (control) {
          control.setJson(controlJson, true);
        }
      } else {
        const control: ControlWrapper | null = form.findControlRecursive(controlJson.meta.name);

        if (control) {
          control.setJson(controlJson, false);
        }
      }
    }
  }

  public findFormById(id: string): FormWrapper | null {
    for (const form of this._forms) {
      if (form.getId() === id) {
        return form;
      }
    }
    return null;
  }

  public findFormByName(name: string): FormWrapper | null {
    for (const form of this._forms) {
      if (form.getName() === name) {
        return form;
      }
    }
    return null;
  }

  public saveState(): any {
    const selectedForm: FormWrapper | null = this._selectedForm$$.getValue();

    const json: any = {
      selectedForm: selectedForm ? selectedForm.getId() : null
    };

    const forms: Array<any> = new Array<any>();

    this._forms.forEach(form => {
      forms.push(form.saveState());
    });

    if (forms.length) {
      json.forms = forms;
    }

    return json;
  }

  public loadState(json: any): void {
    if (json.forms) {
      json.forms.forEach((formJson: any) => {
        const form: FormWrapper = new FormWrapper(this._injector, { state: formJson });

        if (formJson.controls && formJson.controls.length) {
          this.loadControlsState(form, formJson.controls);
        }

        form.loadStateAfterControlsSet(formJson);

        this._forms.push(form);
      });

      this.fireFormsChanged();
    }

    if (json.selectedForm) {
      const form: FormWrapper | null = this.findFormById(json.selectedForm);
      if (form) {
        this.selectForm(form);
      }
    }
  }

  private loadControlsState(form: FormWrapper, controlsJson: Array<any> | null): void {
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

      this._controlsService.createWrapperFromType(controlType, options);
    });
  }
}

import { Injectable } from '@angular/core';

import { ControlWrapper } from 'app/wrappers/control-wrapper';
import { ButtonBaseWrapper } from 'app/wrappers/button-base-wrapper';
import { FormWrapper } from 'app/wrappers/form-wrapper';
import { BarcodeService } from 'app/services/barcode.service';
import { FormsService } from 'app/services/forms.service';

@Injectable()
export class ActionsService {

  constructor(
    private _barcodeService: BarcodeService,
    private _formsService: FormsService
  ) { }

  public processActions(actionsJson: any): void {
    if (!actionsJson || !actionsJson.length) {
      return;
    }

    let globalActions: Array<any> = new Array<any>();

    for (const actionJson of actionsJson) {
      if (actionJson.priority != null) {
        globalActions.push(actionJson);
      } else {
        const form: FormWrapper = this._formsService.findFormById(actionJson.form);
        const control: ControlWrapper = form.findControlRecursive(actionJson.control);

        if (control) {
          switch (actionJson.name) {
            case 'SetCloseButton':
              form.setCloseButtonAction(control as ButtonBaseWrapper);
              break;
            case 'SetEnabled':
              control.setIsEditableAction(actionJson.value);
              break;
            case 'SetFocus':
              control.setFocus();
              break;
            case 'SetVisible':
              control.setVisibilityAction(actionJson.value);
              break;
          }
        }
      }
    }

    globalActions = globalActions.sort((a, b) => {
      const aPrio: number = a.priority;
      const bPrio: number = b.priority;
      if (aPrio > bPrio) {
        return 1;
      } else if (aPrio < bPrio) {
        return -1;
      } else {
        return 0;
      }
    });

    for (const globalAction of globalActions) {
      switch (globalAction.name) {
        case 'ScanBarcode':
          this._barcodeService.scan(globalAction.format);
          break;
      }
    }
  }
}

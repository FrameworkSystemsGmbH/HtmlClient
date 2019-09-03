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

    for (const actionJson of actionsJson) {
      if (actionJson.form != null && actionJson.control != null) {
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
      } else {
        switch (actionJson.name) {
          case 'ScanBarcode':
            this._barcodeService.scan(actionJson.format);
            break;
        }
      }
    }
  }
}

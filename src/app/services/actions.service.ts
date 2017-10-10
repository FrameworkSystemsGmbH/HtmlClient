import { Injectable } from '@angular/core';

import { ControlAction } from '../enums';
import { FormWrapper } from '../wrappers/form-wrapper';
import { FormsService } from './forms.service';

@Injectable()
export class ActionsService {

  constructor(private formsService: FormsService) { }

  public processActions(actionsJson: any): void {
    if (!actionsJson || !actionsJson.length) {
      return;
    }

    for (let actionJson of actionsJson) {
      let form: FormWrapper = this.formsService.findForm(actionJson.form);

      if (!form) {
        continue;
      }

      switch (ControlAction[<string>actionJson.action]) {
        case ControlAction.SetEnabled:

          break;
        case ControlAction.SetVisible:

          break;
        case ControlAction.SetFocus:
          form.setFocusControl(actionJson.control);
          break;
        default:
          throw new Error('Unsupported action \'' + actionJson.action + '\'!');
      }
    }
  }
}

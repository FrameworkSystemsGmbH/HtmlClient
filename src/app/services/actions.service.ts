import { Injectable } from '@angular/core';

import { ControlAction } from '../enums/control-action';
import { FormWrapper } from '../wrappers/form-wrapper';
import { FormsService } from './forms.service';

@Injectable()
export class ActionsService {

  constructor(private formsService: FormsService) { }

  public processActions(actionsJson: any): void {
    if (!actionsJson || !actionsJson.length) {
      return;
    }

    for (const actionJson of actionsJson) {
      const form: FormWrapper = this.formsService.findForm(actionJson.form);

      if (!form) {
        continue;
      }

      switch (ControlAction[actionJson.action as string]) {
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

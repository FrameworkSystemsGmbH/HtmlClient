import { Injectable } from '@angular/core';

import { FormWrapper } from 'app/wrappers/form-wrapper';
import { ControlWrapper } from 'app/wrappers/control-wrapper';
import { FormsService } from 'app/services/forms.service';

@Injectable()
export class ActionsService {

  constructor(private formsService: FormsService) { }

  public processActions(actionsJson: any): void {
    if (!actionsJson || !actionsJson.length) {
      return;
    }

    for (const actionJson of actionsJson) {
      const form: FormWrapper = this.formsService.findFormById(actionJson.form);
      const control: ControlWrapper = form.findControlRecursive(actionJson.control);

      if (control) {
        switch (actionJson.name) {
          case 'SetEnabled':
            control.setIsEditableAction(actionJson.value);
            break;
          case 'SetVisible':
            control.setVisibilityAction(actionJson.value);
            break;
        }
      }
    }
  }
}

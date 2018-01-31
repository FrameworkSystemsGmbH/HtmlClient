import { ClientFormEvent } from 'app/common/events/client-form-event';
import { ControlEvent } from 'app/enums/control-event';

export class ClientClickEvent extends ClientFormEvent {

  constructor(controlName: string, formId: string) {
    super(ControlEvent[ControlEvent.OnClick], controlName, formId);
  }
}

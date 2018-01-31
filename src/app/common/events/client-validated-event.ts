import { ClientFormEvent } from 'app/common/events/client-form-event';
import { ControlEvent } from 'app/enums/control-event';

export class ClientValidatedEvent extends ClientFormEvent {

  constructor(controlName: string, formId: string) {
    super(ControlEvent[ControlEvent.OnValidated], controlName, formId);
  }
}

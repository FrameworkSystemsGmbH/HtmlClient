import { ClientFormEvent } from 'app/common/events/client-form-event';
import { ControlEvent } from 'app/enums/control-event';

export class ClientSelectionChangedEvent extends ClientFormEvent {

  constructor(controlName: string, formId: string) {
    super(ControlEvent[ControlEvent.OnSelectionChanged], controlName, formId);
  }
}

import { ClientFormEvent } from 'app/common/events/client-form-event';
import { ControlEvent } from 'app/enums/control-event';

export class ClientDisposeEvent extends ClientFormEvent {

  constructor(formId: string) {
    super(ControlEvent[ControlEvent.OnDispose], 'DefaultVariant', formId);
  }
}

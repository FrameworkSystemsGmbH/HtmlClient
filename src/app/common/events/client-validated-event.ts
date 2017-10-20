import { ClientEvent } from './client-event';
import { ControlEvent } from '../../enums/control-event';

export class ClientValidatedEvent extends ClientEvent {

  constructor(formId: string, controlName: string) {
    super(ControlEvent[ControlEvent.OnValidated], formId, controlName);
  }
}

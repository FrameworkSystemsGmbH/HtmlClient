import { ClientEvent } from './client-event';
import { ControlEvent } from '../../enums/control-event';

export class ClientEnterEvent extends ClientEvent {

  constructor(formId: string, controlName: string) {
    super(ControlEvent[ControlEvent.OnEnter], formId, controlName);
  }
}

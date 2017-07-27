import { ClientEvent } from '.';
import { ControlEvent } from '../../enums';

export class ClientEnterEvent extends ClientEvent {

  constructor(formId: string, controlName: string) {
    super(ControlEvent[ControlEvent.OnEnter], formId, controlName);
  }
}

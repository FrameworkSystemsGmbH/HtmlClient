import { ClientEvent } from './client-event';
import { ControlEvent } from '../../enums/control-event';

export class ClientClickEvent extends ClientEvent {

  constructor(formId: string, controlName: string) {
    super(ControlEvent[ControlEvent.OnClick], formId, controlName);
  }
}

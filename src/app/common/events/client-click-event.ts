import { ClientEvent } from 'app/common/events/client-event';
import { ControlEvent } from 'app/enums/control-event';

export class ClientClickEvent extends ClientEvent {

  constructor(formId: string, controlName: string) {
    super(ControlEvent[ControlEvent.OnClick], formId, controlName);
  }
}

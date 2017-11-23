import { ClientEvent } from 'app/common/events/client-event';
import { ControlEvent } from 'app/enums/control-event';

export class ClientCloseEvent extends ClientEvent {

  constructor(formId: string) {
    super(ControlEvent[ControlEvent.OnClose], formId, 'DefaultVariant');
  }
}

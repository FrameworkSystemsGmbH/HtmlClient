import { ClientEvent } from 'app/common/events/client-event';
import { ControlEvent } from 'app/enums/control-event';

export class ClientApplicationQuitRequestEvent extends ClientEvent {

  constructor(controlName: string) {
    super(ControlEvent[ControlEvent.OnApplicationQuitRequest], 'Application');
  }
}
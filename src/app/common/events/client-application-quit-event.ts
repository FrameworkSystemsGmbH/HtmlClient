import { ClientEvent } from 'app/common/events/client-event';
import { ControlEvent } from 'app/enums/control-event';

export class ClientApplicationQuitEvent extends ClientEvent {

  constructor(controlName: string) {
    super(ControlEvent[ControlEvent.OnApplicationQuit], 'Application');
  }
}

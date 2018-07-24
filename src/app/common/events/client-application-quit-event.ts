import { ClientApplicationQuitEventArgs } from 'app/common/events/eventargs/client-application-quit-eventargs';
import { ClientEvent } from 'app/common/events/client-event';
import { ControlEvent } from 'app/enums/control-event';

export class ClientApplicationQuitEvent extends ClientEvent {

  protected args: ClientApplicationQuitEventArgs;

  constructor(restartRequested: boolean = null) {
    super(ControlEvent[ControlEvent.OnApplicationQuit], 'Application');
    this.args = new ClientApplicationQuitEventArgs(restartRequested);
  }
}

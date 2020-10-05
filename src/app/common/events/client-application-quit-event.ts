import { ClientControlEvent } from '@app/common/events/client-control-event';
import { ClientApplicationQuitEventArgs } from '@app/common/events/eventargs/client-application-quit-eventargs';
import { ClientEventType } from '@app/enums/client-event-type';

export class ClientApplicationQuitEvent extends ClientControlEvent {

  protected args: ClientApplicationQuitEventArgs;

  constructor(restartRequested: boolean = null) {
    super(ClientEventType[ClientEventType.OnApplicationQuit], 'Application');
    this.args = new ClientApplicationQuitEventArgs(restartRequested);
  }
}

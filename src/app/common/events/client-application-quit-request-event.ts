import { ClientControlEvent } from '@app/common/events/client-control-event';
import { ClientEventType } from '@app/enums/client-event-type';

export class ClientApplicationQuitRequestEvent extends ClientControlEvent {

  public constructor() {
    super(ClientEventType[ClientEventType.OnApplicationQuitRequest], 'Application');
  }
}

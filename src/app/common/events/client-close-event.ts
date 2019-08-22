import { ClientFormEvent } from 'app/common/events/client-form-event';
import { ClientEventType } from 'app/enums/client-event-type';

export class ClientCloseEvent extends ClientFormEvent {

  constructor(formId: string) {
    super(ClientEventType[ClientEventType.OnClose], 'DefaultVariant', formId);
  }
}

import { ClientFormEvent } from '@app/common/events/client-form-event';
import { ClientEventType } from '@app/enums/client-event-type';

export class ClientValidatedEvent extends ClientFormEvent {

  constructor(controlName: string, formId: string) {
    super(ClientEventType[ClientEventType.OnValidated], controlName, formId);
  }
}

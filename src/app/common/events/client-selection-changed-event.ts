import { ClientFormEvent } from '@app/common/events/client-form-event';
import { ClientEventType } from '@app/enums/client-event-type';

export class ClientSelectionChangedEvent extends ClientFormEvent {

  public constructor(controlName: string, formId: string) {
    super(ClientEventType[ClientEventType.OnSelectionChanged], controlName, formId);
  }
}

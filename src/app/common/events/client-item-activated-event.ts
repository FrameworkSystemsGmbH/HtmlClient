import { ClientFormEvent } from '@app/common/events/client-form-event';
import { ClientItemActivatedEventArgs } from '@app/common/events/eventargs/client-item-activated-eventargs';
import { ClientEventType } from '@app/enums/client-event-type';

export class ClientItemActivatedEvent extends ClientFormEvent {

  protected args: ClientItemActivatedEventArgs;

  public constructor(controlName: string, formId: string, itemId: string, itemIndex: number) {
    super(ClientEventType[ClientEventType.OnItemActivated], controlName, formId);
    this.args = new ClientItemActivatedEventArgs(itemId, itemIndex);
  }
}

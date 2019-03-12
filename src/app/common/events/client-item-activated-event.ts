import { ClientFormEvent } from 'app/common/events/client-form-event';
import { ClientItemActivatedEventArgs } from 'app/common/events/eventargs/client-item-activated-eventargs';
import { ControlEvent } from 'app/enums/control-event';

export class ClientItemActivatedEvent extends ClientFormEvent {

  protected args: ClientItemActivatedEventArgs;

  constructor(controlName: string, formId: string, itemId: string, itemIndex: number) {
    super(ControlEvent[ControlEvent.OnItemActivated], controlName, formId);
    this.args = new ClientItemActivatedEventArgs(itemId, itemIndex);
  }
}

import { ClientFormEvent } from 'app/common/events/client-form-event';
import { ClientLeaveEventArgs } from 'app/common/events/eventargs/client-leave-eventargs';
import { ControlEvent } from 'app/enums/control-event';

export class ClientLeaveEvent extends ClientFormEvent {

  protected args: ClientLeaveEventArgs;

  constructor(controlName: string, formId: string, activator: string, hasValueChanged: boolean) {
    super(ControlEvent[ControlEvent.OnLeave], controlName, formId);
    this.args = new ClientLeaveEventArgs(activator, String.empty(), hasValueChanged);
  }
}

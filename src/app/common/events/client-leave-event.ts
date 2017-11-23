import { ClientEvent } from 'app/common/events/client-event';
import { ClientLeaveEventArgs } from 'app/common/events/eventargs/client-leave-eventargs';
import { ControlEvent } from 'app/enums/control-event';

export class ClientLeaveEvent extends ClientEvent {

  protected args: ClientLeaveEventArgs;

  constructor(formId: string, controlName: string, activator: string, hasValueChanged: boolean) {
    super(ControlEvent[ControlEvent.OnLeave], formId, controlName);
    this.args = new ClientLeaveEventArgs(activator, String.empty(), hasValueChanged);
  }
}

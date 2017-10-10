import { ClientEvent } from './client-event';
import { ControlEvent } from '../../enums/control-event';
import { ClientLeaveEventArgs } from './eventargs/client-leave-eventargs';

export class ClientLeaveEvent extends ClientEvent {

  private args: ClientLeaveEventArgs;

  constructor(formId: string, controlName: string, activator: string, hasValueChanged: boolean) {
    super(ControlEvent[ControlEvent.OnLeave], formId, controlName);
    this.args = new ClientLeaveEventArgs(activator, String.empty(), hasValueChanged);
  }
}

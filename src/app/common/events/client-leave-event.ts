import { ClientEvent } from '.';
import { ControlEvent } from '../../enums';
import { ClientLeaveEventArgs } from './eventargs';

export class ClientLeaveEvent extends ClientEvent {

  private args: ClientLeaveEventArgs;

  constructor(formId: string, controlName: string, activator: string, hasValueChanged: boolean) {
    super(ControlEvent[ControlEvent.OnLeave], formId, controlName);
    this.args = new ClientLeaveEventArgs(activator, String.empty(), hasValueChanged);
  }

}

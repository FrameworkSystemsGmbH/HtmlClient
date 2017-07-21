import { ClientEvent } from '.';
import { ControlEvent } from '../../enums';
import { ClientLeaveEventArgs } from './eventargs';

export class ClientLeaveEvent extends ClientEvent {

  private args: ClientLeaveEventArgs;

  constructor(formId: string, controlName: string, hasValueChanged: boolean) {
    super(ControlEvent[ControlEvent.OnLeave], formId, controlName);
    this.args = new ClientLeaveEventArgs('Mouse', String.empty(), hasValueChanged);
  }

}

import { ClientEvent } from '.';
import { ControlEvent } from '../../enums';

export class ClientLeaveEvent extends ClientEvent {

  private activator: string;
  private hasValueChanged: boolean;
  private nextControlName: string;

  constructor(formId: string, controlName: string, hasValueChanged: boolean) {
    super(ControlEvent[ControlEvent.OnLeave], formId, controlName);
    this.activator = 'Mouse';
    this.hasValueChanged = hasValueChanged;
    this.nextControlName = String.empty();
  }

}

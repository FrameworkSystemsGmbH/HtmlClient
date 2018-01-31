import { ClientFormEvent } from 'app/common/events/client-form-event';
import { ControlEvent } from 'app/enums/control-event';

export class ClientMsgBoxEvent extends ClientFormEvent {

  protected id: string;
  protected action: string;

  constructor(formId: string, id: string, action: string) {
    super(ControlEvent[ControlEvent.MsgBox], 'DefaultVariant', formId);
    this.id = id;
    this.action = action;
  }
}

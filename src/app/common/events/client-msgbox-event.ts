import { ClientFormEvent } from '@app/common/events/client-form-event';
import { ClientEventType } from '@app/enums/client-event-type';

export class ClientMsgBoxEvent extends ClientFormEvent {

  protected id: string;
  protected action: string;

  public constructor(formId: string, id: string, action: string) {
    super(ClientEventType[ClientEventType.MsgBox], 'DefaultVariant', formId);
    this.id = id;
    this.action = action;
  }
}

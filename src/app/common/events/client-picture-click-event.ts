import { ClientFormEvent } from 'app/common/events/client-form-event';
import { ClientEventType } from 'app/enums/client-event-type';
import { ClientPictureClickEventArgs } from 'app/common/events/eventargs/client-picture-click-eventargs';

export class ClientPictureClickEvent extends ClientFormEvent {

  protected args: ClientPictureClickEventArgs;

  constructor(controlName: string, formId: string, args: ClientPictureClickEventArgs) {
    super(ClientEventType[ClientEventType.OnClick], controlName, formId);
    this.args = args;
  }
}

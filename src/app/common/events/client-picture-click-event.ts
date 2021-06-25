import { ClientFormEvent } from '@app/common/events/client-form-event';
import { ClientPictureClickEventArgs } from '@app/common/events/eventargs/client-picture-click-eventargs';
import { ClientEventType } from '@app/enums/client-event-type';

export class ClientPictureClickEvent extends ClientFormEvent {

  protected args: ClientPictureClickEventArgs;

  public constructor(controlName: string, formId: string, args: ClientPictureClickEventArgs) {
    super(ClientEventType[ClientEventType.OnClick], controlName, formId);
    this.args = args;
  }
}

import { ClientEvent } from '@app/common/events/client-event';
import { ClientEventType } from '@app/enums/client-event-type';
import { ClientPhotoTakenEventArgs } from '@app/common/events/eventargs/client-photo-taken-eventargs';

export class ClientPhotoTakenEvent extends ClientEvent {

  protected args: ClientPhotoTakenEventArgs;

  constructor(hasError: boolean, errorMessage: string, imageData: string) {
    super(ClientEventType[ClientEventType.PhotoTaken]);
    this.args = new ClientPhotoTakenEventArgs(hasError, errorMessage, imageData);
  }
}

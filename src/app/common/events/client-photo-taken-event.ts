import { ClientEvent } from '@app/common/events/client-event';
import { ClientPhotoTakenEventArgs } from '@app/common/events/eventargs/client-photo-taken-eventargs';
import { ClientEventType } from '@app/enums/client-event-type';

export class ClientPhotoTakenEvent extends ClientEvent {

  protected args: ClientPhotoTakenEventArgs;

  constructor(hasError: boolean, errorMessage: string, imageData: string) {
    super(ClientEventType[ClientEventType.PhotoTaken]);
    this.args = new ClientPhotoTakenEventArgs(hasError, errorMessage, imageData);
  }
}

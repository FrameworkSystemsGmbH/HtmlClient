import { ClientEvent } from '@app/common/events/client-event';

export class ClientControlEvent extends ClientEvent {

  protected controlName: string;

  public constructor(event: string, controlName: string) {
    super(event);
    this.controlName = controlName;
  }
}

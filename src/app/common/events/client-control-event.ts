import { ClientEvent } from 'app/common/events/client-event';

export class ClientControlEvent extends ClientEvent {

  protected controlName: string;

  constructor(event: string, controlName: string) {
    super(event);
    this.controlName = controlName;
  }
}

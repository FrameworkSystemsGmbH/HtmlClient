import { ClientEvent } from 'app/common/events/client-event';

export abstract class ClientFormEvent extends ClientEvent {

  protected formId: string;

  constructor(event: string, controlName: string, formId: string) {
    super(event, controlName);
    this.formId = formId;
  }
}

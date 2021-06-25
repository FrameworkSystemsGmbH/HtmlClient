import { ClientControlEvent } from '@app/common/events/client-control-event';

export abstract class ClientFormEvent extends ClientControlEvent {

  protected formId: string;

  public constructor(event: string, controlName: string, formId: string) {
    super(event, controlName);
    this.formId = formId;
  }
}

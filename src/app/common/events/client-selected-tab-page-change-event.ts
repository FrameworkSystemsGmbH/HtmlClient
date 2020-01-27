import { ClientFormEvent } from 'app/common/events/client-form-event';
import { ClientSelectedTabPageChangeEventArgs } from 'app/common/events/eventargs/client-selected-tab-page-change-eventargs';
import { ClientEventType } from 'app/enums/client-event-type';

export class ClientSelectedTabPageChangeEvent extends ClientFormEvent {

  protected args: ClientSelectedTabPageChangeEventArgs;

  constructor(controlName: string, formId: string, lastTab: string, selectedTab: string) {
    super(ClientEventType[ClientEventType.OnSelectedTabPageChange], controlName, formId);
    this.args = new ClientSelectedTabPageChangeEventArgs(lastTab, selectedTab);
  }
}

import { ClientFormEvent } from '@app/common/events/client-form-event';
import { ClientSelectedTabPageChangedEventArgs } from '@app/common/events/eventargs/client-selected-tab-page-changed-eventargs';
import { ClientEventType } from '@app/enums/client-event-type';

export class ClientSelectedTabPageChangedEvent extends ClientFormEvent {

  protected args: ClientSelectedTabPageChangedEventArgs;

  public constructor(controlName: string, formId: string, lastTab: string, selectedTab: string) {
    super(ClientEventType[ClientEventType.OnSelectedTabPageChanged], controlName, formId);
    this.args = new ClientSelectedTabPageChangedEventArgs(lastTab, selectedTab);
  }
}

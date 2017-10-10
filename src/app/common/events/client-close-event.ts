import { ClientEvent } from './client-event';
import { ControlEvent } from '../../enums/control-event';

export class ClientCloseEvent extends ClientEvent {

  constructor(formId: string) {
    super(ControlEvent[ControlEvent.OnClose], formId, 'DefaultVariant');
  }
}

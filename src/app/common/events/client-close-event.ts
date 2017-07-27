import { ClientEvent } from '.';
import { ControlEvent } from '../../enums';

export class ClientCloseEvent extends ClientEvent {

  constructor(formId: string) {
    super(ControlEvent[ControlEvent.OnClose], formId, 'DefaultVariant');
  }
}

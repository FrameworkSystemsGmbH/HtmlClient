import { ClientEvent } from './client-event';
import { ControlEvent } from '../../enums/control-event';

export class ClientDisposeEvent extends ClientEvent {

  constructor(formId: string) {
    super(ControlEvent[ControlEvent.OnDispose], formId, 'DefaultVariant');
  }
}

import { ClientEvent } from '.';
import { ControlEvent } from '../../enums';

export class ClientDisposeEvent extends ClientEvent {

  constructor(formId: string) {
    super(ControlEvent[ControlEvent.OnDispose], formId, 'DefaultVariant');
  }
}

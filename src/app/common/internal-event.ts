import { ClientEvent } from './events/client-event';
import { InternalEventCallbacks } from './internal-event-callbacks';

export class InternalEvent {
  constructor(
    public clientEvent: ClientEvent,
    public callbacks: InternalEventCallbacks
  ) { }
}

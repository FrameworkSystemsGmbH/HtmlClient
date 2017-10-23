import { ClientEvent } from '../client-event';
import { InternalEventCallbacks } from './internal-event-callbacks';

export class InternalEvent<T extends ClientEvent> {
  originalEvent: any;
  clientEvent: T;
  callbacks: InternalEventCallbacks<T>;
}

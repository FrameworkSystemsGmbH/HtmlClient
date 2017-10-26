import { ClientEvent } from '../client-event';
import { InternalEventCallbacks } from './internal-event-callbacks';

export class InternalEvent<T extends ClientEvent> {
  public originalEvent: any;
  public clientEvent: T;
  public callbacks: InternalEventCallbacks<T>;
}

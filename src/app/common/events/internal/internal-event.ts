import { ClientEvent } from 'app/common/events/client-event';
import { InternalEventCallbacks } from 'app/common/events/internal/internal-event-callbacks';

export class InternalEvent<T extends ClientEvent> {
  public clientEvent: T;
  public payload?: any;
  public callbacks?: InternalEventCallbacks<T>;
}

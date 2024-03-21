import { ClientEvent } from '@app/common/events/client-event';
import { InternalEventCallbacks } from '@app/common/events/internal/internal-event-callbacks';

/**
 * Wrapper für ClientEvent mit Payload und InternalEventCallbacks
 */
export class InternalEvent<T extends ClientEvent> {

  private readonly _clientEvent: T;

  private _payload: any = null;
  private _callbacks: InternalEventCallbacks | null = null;

  public constructor(clientEvent: T) {
    this._clientEvent = clientEvent;
  }

  public get clientEvent(): T {
    return this._clientEvent;
  }

  public get payload(): any {
    return this._payload;
  }
  /**DRE: wird derzeit nur im fireSelectedTabPageChange verwendet?! Der Zusammenhang mit Callbacks fehlt mir im Moment */
  public set payload(value: any) {
    this._payload = value;
  }

  public get callbacks(): InternalEventCallbacks | null {
    return this._callbacks;
  }

  public set callbacks(value: InternalEventCallbacks | null) {
    this._callbacks = value;
  }
}

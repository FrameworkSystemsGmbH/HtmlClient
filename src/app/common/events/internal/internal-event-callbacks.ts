import { ClientEvent } from '@app/common/events/client-event';

export class InternalEventCallbacks<T extends ClientEvent> {
  public constructor(
    public canExecute: (clientEvent: T, payload: any) => boolean,
    public onExecuted: (clientEvent: T, payload: any, processedEvent: any) => void = null,
    public onCompleted: (clientEvent: T, payload: any, processedEvent: any) => void = null
  ) { }
}

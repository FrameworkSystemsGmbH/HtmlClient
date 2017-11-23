import { ClientEvent } from 'app/common/events/client-event';

export class InternalEventCallbacks<T extends ClientEvent> {
  constructor(
    public canExecute: (originalEvent: any, clientEvent: T) => boolean,
    public onExecuted: (originalEvent: any, clientEvent: T) => void = null,
    public onCompleted: (originalEvent: any, clientEvent: T) => void = null
  ) { }
}

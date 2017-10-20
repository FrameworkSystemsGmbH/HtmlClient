export class InternalEventCallbacks {
  constructor(
    public canExecute: () => boolean,
    public onExecuted: () => void = null,
    public onCompleted: () => void = null
  ) { }
}

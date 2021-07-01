export class InternalEventCallbacks {

  private readonly _canExecute: (payload: any) => boolean;
  private readonly _onExecuted: ((payload: any, processedEvent: any) => void) | null = null;
  private readonly _onCompleted: ((payload: any, processedEvent: any) => void) | null = null;

  public constructor(
    canExecute: (payload: any) => boolean,
    onExecuted: ((payload: any, processedEvent: any) => void) | null,
    onCompleted: ((payload: any, processedEvent: any) => void) | null
  ) {
    this._canExecute = canExecute;
    this._onExecuted = onExecuted;
    this._onCompleted = onCompleted;
  }

  public get canExecute(): (payload: any) => boolean {
    return this._canExecute;
  }

  public get onExecuted(): (((payload: any, processedEvent: any) => void) | null) {
    return this._onExecuted;
  }

  public get onCompleted(): (((payload: any, processedEvent: any) => void) | null) {
    return this._onCompleted;
  }
}

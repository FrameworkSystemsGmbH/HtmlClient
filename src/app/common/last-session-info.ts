import * as Moment from 'moment-timezone';

export class LastSessionInfo {

  public constructor(
    private readonly _lastBroker: string,
    private readonly _lastRequestTime: Moment.Moment,
    private readonly _stateJson: any
  ) { }

  public getLastBroker(): string {
    return this._lastBroker;
  }

  public getLastRequestTime(): Moment.Moment {
    return this._lastRequestTime;
  }

  public getStateJson(): any {
    return this._stateJson;
  }
}

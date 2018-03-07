import * as Moment from 'moment-timezone';

export class LastSessionInfo {

  constructor(
    private _lastBroker: string,
    private _lastBrokerDev: boolean,
    private _lastRequestTime: Moment.Moment,
    private _stateJson: any
  ) { }

  public getLastBroker(): string {
    return this._lastBroker;
  }

  public getLastBrokerDev(): boolean {
    return this._lastBrokerDev;
  }

  public getLastRequestTime(): Moment.Moment {
    return this._lastRequestTime;
  }

  public getStateJson(): any {
    return this._stateJson;
  }
}

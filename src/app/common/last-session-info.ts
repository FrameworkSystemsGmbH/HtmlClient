import * as Moment from 'moment-timezone';

export class LastSessionInfo {

  constructor(
    private _lastBroker: string,
    private _lastBrokerDev: boolean,
    private _lastRequestTime: Moment.Moment
  ) { }

  public getLastBroker(): string {
    return this._lastBroker;
  }

  public getLastBrokerDev(): boolean {
    return this._lastBrokerDev;
  }

  public getLastRequestTimeString(): string {
    return this._lastRequestTime.format('L LTS');
  }
}

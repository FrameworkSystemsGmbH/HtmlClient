import * as Moment from 'moment-timezone';

export class LastSessionInfo {

  private readonly _lastBroker: string;
  private readonly _lastRequestTime: Moment.Moment;
  private readonly _stateJson: any;

  public constructor(
    lastBroker: string,
    lastRequestTime: Moment.Moment,
    stateJson: any
  ) {
    this._lastBroker = lastBroker;
    this._lastRequestTime = lastRequestTime;
    this._stateJson = stateJson;
  }

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

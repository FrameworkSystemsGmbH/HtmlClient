import { Injectable } from '@angular/core';
import { LoginBroker } from '@app/common/login-broker';
import { ClientDataService } from '@app/services/client-data.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class LoginService {

  private _brokers$$: BehaviorSubject<Array<LoginBroker>>;
  private _brokers$: Observable<Array<LoginBroker>>;

  constructor(private clientDataService: ClientDataService) {
    this._brokers$$ = new BehaviorSubject<Array<LoginBroker>>(new Array<LoginBroker>());
    this._brokers$ = this._brokers$$.asObservable();

    this.clientDataService.loadBrokerList().subscribe(brokerList => {
      this._brokers$$.next(brokerList);
    });
  }

  public getBrokers(): Observable<Array<LoginBroker>> {
    return this._brokers$;
  }

  public addBroker(broker: LoginBroker): void {
    let brokers: Array<LoginBroker> = this._brokers$$.getValue();

    if (!brokers) {
      brokers = new Array<LoginBroker>();
    }

    brokers.push(broker);

    this.clientDataService.saveBrokerList(brokers).subscribe(() => this._brokers$$.next(brokers));
  }

  public updateBroker(index: number, broker: LoginBroker): void {
    const brokers: Array<LoginBroker> = this._brokers$$.getValue();
    brokers[index] = broker;
    this.clientDataService.saveBrokerList(brokers).subscribe(() => this._brokers$$.next(brokers));
  }

  public deleteBroker(index: number): void {
    const brokers: Array<LoginBroker> = this._brokers$$.getValue();
    brokers.splice(index, 1);
    this.clientDataService.saveBrokerList(brokers).subscribe(() => this._brokers$$.next(brokers));
  }
}

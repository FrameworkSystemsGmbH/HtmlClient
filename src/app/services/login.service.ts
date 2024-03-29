import { Injectable } from '@angular/core';
import { LoginBroker } from '@app/common/login-broker';
import { ClientDataService } from '@app/services/client-data.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoginService {

  private readonly _clientDataService: ClientDataService;

  private readonly _brokers$$: BehaviorSubject<Array<LoginBroker>>;
  private readonly _brokers$: Observable<Array<LoginBroker>>;

  public constructor(clientDataService: ClientDataService) {
    this._clientDataService = clientDataService;

    this._brokers$$ = new BehaviorSubject<Array<LoginBroker>>(new Array<LoginBroker>());
    this._brokers$ = this._brokers$$.asObservable();

    this._clientDataService.loadBrokerList().subscribe({
      next: brokerList => {
        this._brokers$$.next(brokerList);
      }
    });
  }

  public getBrokers(): Observable<Array<LoginBroker>> {
    return this._brokers$;
  }

  public addOrUpdateBroker(broker: LoginBroker): void {
    const brokers: Array<LoginBroker> = this._brokers$$.getValue();

    const index: number = brokers.findIndex(b => b.name.toLowerCase() === broker.name.toLowerCase());

    if (index >= 0) {
      brokers[index].url = broker.url;
    } else {
      brokers.push(broker);
    }

    this._clientDataService.saveBrokerList(brokers).subscribe({
      next: () => this._brokers$$.next(brokers)
    });
  }

  public deleteBroker(broker: LoginBroker): void {
    const brokers: Array<LoginBroker> = this._brokers$$.getValue();
    brokers.remove(broker);
    this._clientDataService.saveBrokerList(brokers).subscribe({
      next: () => this._brokers$$.next(brokers)
    });
  }
}

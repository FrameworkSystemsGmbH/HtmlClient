import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { LoginBroker } from 'app/common/login-broker';
import { ClientDataService } from 'app/services/client-data.service';

@Injectable()
export class LoginService {

  private onBrokersChanged: BehaviorSubject<Array<LoginBroker>>;

  constructor(private clientDataService: ClientDataService) {
    this.onBrokersChanged = new BehaviorSubject<Array<LoginBroker>>(new Array<LoginBroker>());

    this.clientDataService.loadBrokerList().subscribe(brokerList => {
      this.onBrokersChanged.next(brokerList);
    });
  }

  public getBrokers(): Observable<Array<LoginBroker>> {
    return this.onBrokersChanged.asObservable();
  }

  public addBroker(broker: LoginBroker): void {
    let brokers: Array<LoginBroker> = this.onBrokersChanged.getValue();

    if (!brokers) {
      brokers = new Array<LoginBroker>();
    }

    brokers.push(broker);

    this.clientDataService.saveBrokerList(brokers).subscribe(saved => {
      if (saved) {
        this.onBrokersChanged.next(brokers);
      }
    });
  }

  public updateBroker(index: number, broker: LoginBroker): void {
    const brokers: Array<LoginBroker> = this.onBrokersChanged.getValue();
    brokers[index] = broker;
    this.clientDataService.saveBrokerList(brokers).subscribe(saved => {
      if (saved) {
        this.onBrokersChanged.next(brokers);
      }
    });
  }

  public deleteBroker(index: number): void {
    const brokers: Array<LoginBroker> = this.onBrokersChanged.getValue();
    brokers.splice(index, 1);
    this.clientDataService.saveBrokerList(brokers).subscribe(saved => {
      if (saved) {
        this.onBrokersChanged.next(brokers);
      }
    });
  }
}

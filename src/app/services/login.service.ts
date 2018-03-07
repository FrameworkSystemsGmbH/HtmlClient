import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { LoginBroker } from 'app/common/login-broker';
import { StorageService } from 'app/services/storage/storage.service';

const BROKER_STORAGE_KEY: string = 'brokerList';

@Injectable()
export class LoginService {

  private onBrokersChanged: BehaviorSubject<Array<LoginBroker>>;

  constructor(private storageService: StorageService) {
    this.onBrokersChanged = new BehaviorSubject<Array<LoginBroker>>(new Array<LoginBroker>());

    this.storageService.loadData(BROKER_STORAGE_KEY)
      .map(data => JSON.parse(data))
      .subscribe(logins => {
        this.onBrokersChanged.next(logins);
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

    this.saveBrokers(brokers).subscribe(saved => {
      if (saved) {
        this.onBrokersChanged.next(brokers);
      }
    });
  }

  public updateBroker(index: number, broker: LoginBroker): void {
    const brokers: Array<LoginBroker> = this.onBrokersChanged.getValue();
    brokers[index] = broker;
    this.saveBrokers(brokers).subscribe(saved => {
      if (saved) {
        this.onBrokersChanged.next(brokers);
      }
    });
  }

  public deleteBroker(index: number): void {
    const brokers: Array<LoginBroker> = this.onBrokersChanged.getValue();
    brokers.splice(index, 1);
    this.saveBrokers(brokers).subscribe(saved => {
      if (saved) {
        this.onBrokersChanged.next(brokers);
      }
    });
  }

  private saveBrokers(brokers: Array<LoginBroker>): Observable<boolean> {
    return this.storageService.saveData(BROKER_STORAGE_KEY, JSON.stringify(brokers));
  }
}

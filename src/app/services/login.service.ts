import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { LoginBroker } from 'app/common/login-broker';
import { StorageService } from 'app/services/storage.service';

const BROKER_STORAGE_KEY: string = 'brokerList';

@Injectable()
export class LoginService {

  private brokers: BehaviorSubject<Array<LoginBroker>>;

  constructor(private storageService: StorageService) {
    this.brokers = new BehaviorSubject<Array<LoginBroker>>(null);

    this.storageService.loadData(BROKER_STORAGE_KEY)
      .map(data => JSON.parse(data))
      .subscribe(logins => {
        this.brokers.next(logins);
      });
  }

  public getBrokers(): Observable<Array<LoginBroker>> {
    return this.brokers.asObservable();
  }

  public addBroker(broker: LoginBroker): void {
    let brokers: Array<LoginBroker> = this.brokers.getValue();

    if (!brokers) {
      brokers = new Array<LoginBroker>();
    }

    brokers.push(broker);

    this.saveBrokers(brokers).subscribe(saved => {
      if (saved) {
        this.brokers.next(brokers);
      }
    });
  }

  public updateBroker(index: number, broker: LoginBroker): void {
    const brokers: Array<LoginBroker> = this.brokers.getValue();
    brokers[index] = broker;
    this.saveBrokers(brokers).subscribe(saved => {
      if (saved) {
        this.brokers.next(brokers);
      }
    });
  }

  public deleteBroker(index: number): void {
    const brokers: Array<LoginBroker> = this.brokers.getValue();
    brokers.splice(index, 1);
    this.saveBrokers(brokers).subscribe(saved => {
      if (saved) {
        this.brokers.next(brokers);
      }
    });
  }

  private saveBrokers(brokers: Array<LoginBroker>): Observable<boolean> {
    return this.storageService.saveData(BROKER_STORAGE_KEY, JSON.stringify(brokers));
  }
}

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { LoginBroker } from '../common/login-broker';
import { StorageService } from './storage.service';

const BROKER_STORAGE_KEY: string = 'brokerList';

@Injectable()
export class LoginService {

  private logins: BehaviorSubject<Array<LoginBroker>>;

  constructor(private storageService: StorageService) {
    this.logins = new BehaviorSubject<Array<LoginBroker>>(this.loadBrokers());
  }

  public getBrokers(): Observable<Array<LoginBroker>> {
    return this.logins.asObservable();
  }

  public addBroker(broker: LoginBroker): void {
    let logins: Array<LoginBroker> = this.logins.getValue();

    if (!logins) {
      logins = new Array<LoginBroker>();
    }

    logins.push(broker);
    this.saveBrokers(logins);
    this.logins.next(logins);
  }

  public deleteBroker(index: number): void {
    let brokers: Array<LoginBroker> = this.logins.getValue();
    brokers.splice(index, 1);
    this.saveBrokers(brokers);
    this.logins.next(brokers);
  }

  private saveBrokers(brokers: Array<LoginBroker>): void {
    this.storageService.saveData(BROKER_STORAGE_KEY, JSON.stringify(brokers));
  }

  private loadBrokers(): Array<LoginBroker> {
    return JSON.parse(this.storageService.loadData(BROKER_STORAGE_KEY));
  }
}

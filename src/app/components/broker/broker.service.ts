import { Injectable, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Broker } from './broker';
import { StorageService } from '../../services';

const BROKER_STORAGE_KEY: string = 'brokerList';

@Injectable()
export class BrokerService {

  private _brokers: BehaviorSubject<Array<Broker>>;

  constructor(private _storageService: StorageService) {
    this._brokers = new BehaviorSubject<Array<Broker>>(this.loadBrokers());
  }

  public getBrokers(): Observable<Array<Broker>> {
    return this._brokers.asObservable();
  }

  public addBroker(broker: Broker): void {
    let brokers: Array<Broker> = this._brokers.getValue();

    if (!brokers) {
      brokers = new Array<Broker>();
    }

    brokers.push(broker);
    this.saveBrokers(brokers);
    this._brokers.next(brokers);
  }

  public deleteBroker(index: number): void {
    let brokers: Array<Broker> = this._brokers.getValue();
    brokers.splice(index, 1);
    this.saveBrokers(brokers);
    this._brokers.next(brokers);
  }

  private saveBrokers(brokers: Array<Broker>): void {
    this._storageService.saveData(BROKER_STORAGE_KEY, JSON.stringify(brokers));
  }

  private loadBrokers(): Array<Broker> {
    return JSON.parse(this._storageService.loadData(BROKER_STORAGE_KEY));
  }
}

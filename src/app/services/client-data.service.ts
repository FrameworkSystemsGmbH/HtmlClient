import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';

import { LoginBroker } from 'app/common/login-broker';
import { StorageService } from 'app/services/storage.service';

const { Device } = Plugins;

@Injectable()
export class ClientDataService {

  private static readonly BROKER_LIST: string = 'BrokerList';
  private static readonly SESSION_DATA: string = 'SessionData';

  constructor(private _storageService: StorageService) { }

  public loadBrokerList(): Observable<Array<LoginBroker>> {
    return this._storageService.load(ClientDataService.BROKER_LIST).pipe(
      map(brokerListStr => JSON.parse(brokerListStr))
    );
  }

  public saveBrokerList(brokerList: Array<LoginBroker>): Observable<void> {
    return this._storageService.save(ClientDataService.BROKER_LIST, JSON.stringify(brokerList));
  }

  public loadSessionData(): Observable<string> {
    return this._storageService.load(ClientDataService.SESSION_DATA);
  }

  public saveSessionData(sessionData: string): Observable<void> {
    return this._storageService.save(ClientDataService.SESSION_DATA, sessionData);
  }

  public deleteSessionData(): Observable<void> {
    return this._storageService.delete(ClientDataService.SESSION_DATA);
  }

  public getDeviceUuid(): Observable<string> {
    return from(Device.getInfo()).pipe(mergeMap(info => info.uuid));
  }
}

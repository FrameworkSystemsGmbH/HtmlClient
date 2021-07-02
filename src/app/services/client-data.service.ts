import { Injectable } from '@angular/core';
import { LoginBroker } from '@app/common/login-broker';
import { StorageService } from '@app/services/storage.service';
import { Plugins } from '@capacitor/core';
import { from, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

const { Device } = Plugins;

@Injectable({ providedIn: 'root' })
export class ClientDataService {

  private static readonly BROKER_LIST: string = 'BrokerList';
  private static readonly SESSION_DATA: string = 'SessionData';

  private readonly _storageService: StorageService;

  public constructor(storageService: StorageService) {
    this._storageService = storageService;
  }

  public loadBrokerList(): Observable<Array<LoginBroker>> {
    return this._storageService.load(ClientDataService.BROKER_LIST).pipe(
      map(brokerListStr => {
        if (brokerListStr != null) {
          return JSON.parse(brokerListStr) as Array<LoginBroker>;
        } else {
          return new Array<LoginBroker>();
        }
      })
    );
  }

  public saveBrokerList(brokerList: Array<LoginBroker>): Observable<void> {
    return this._storageService.save(ClientDataService.BROKER_LIST, JSON.stringify(brokerList));
  }

  public loadSessionData(): Observable<string | null> {
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

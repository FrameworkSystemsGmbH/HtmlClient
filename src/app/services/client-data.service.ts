import { Injectable } from '@angular/core';
import { LoginBroker } from '@app/common/login-broker';
import { StorageService } from '@app/services/storage.service';
import { Device } from '@capacitor/device';
import { from, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

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
          const brokerArrJson: any = JSON.parse(brokerListStr);
          const brokerArr: Array<LoginBroker> = new Array<LoginBroker>();
          if (brokerArrJson.length > 0) {
            for (const brokerJson of brokerArrJson) {
              const broker: LoginBroker | null = LoginBroker.getFromJson(brokerJson);
              if (broker != null) {
                brokerArr.push(broker);
              }
            }
          }
          return brokerArr;
        } else {
          return new Array<LoginBroker>();
        }
      })
    );
  }

  public saveBrokerList(brokerList: Array<LoginBroker>): Observable<void> {
    const storageArr: Array<any> = new Array<any>();

    for (const broker of brokerList) {
      storageArr.push(broker.getJson());
    }

    return this._storageService.save(ClientDataService.BROKER_LIST, JSON.stringify(storageArr));
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
    return from(Device.getId()).pipe(mergeMap(info => info.uuid));
  }
}

import { Injectable } from '@angular/core';
import { LoginBroker } from '@app/common/login-broker';
import { FileStorageService } from '@app/services/storage/file-storage.service';
import { WebStorageService } from '@app/services/storage/web-storage.service';
import { Device } from '@capacitor/device';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ClientDataService {

  private static readonly BROKER_LIST: string = 'BrokerList';
  private static readonly SESSION_DATA: string = 'SessionData';

  private readonly _fileStorageService: FileStorageService;
  private readonly _webStorageService: WebStorageService;

  public constructor(
    fileStorageService: FileStorageService,
    webStorageService: WebStorageService
  ) {
    this._fileStorageService = fileStorageService;
    this._webStorageService = webStorageService;
  }

  public loadBrokerList(): Observable<Array<LoginBroker>> {
    return this._fileStorageService.load(ClientDataService.BROKER_LIST).pipe(
      map(brokerListStr => {
        if (brokerListStr == null) {
          return new Array<LoginBroker>();
        }

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
      })
    );
  }

  public saveBrokerList(brokerList: Array<LoginBroker>): Observable<void> {
    const storageArr: Array<any> = new Array<any>();

    for (const broker of brokerList) {
      storageArr.push(broker.getJson());
    }

    if (storageArr.length === 0) {
      return this._fileStorageService.delete(ClientDataService.BROKER_LIST);
    } else {
      return this._fileStorageService.save(ClientDataService.BROKER_LIST, JSON.stringify(storageArr));
    }
  }

  public loadSessionData(): string | null {
    return this._webStorageService.load(ClientDataService.SESSION_DATA);
  }

  public saveSessionData(sessionData: string): void {
    return this._webStorageService.save(ClientDataService.SESSION_DATA, sessionData);
  }

  public deleteSessionData(): void {
    return this._webStorageService.delete(ClientDataService.SESSION_DATA);
  }

  public getDeviceUuid(): Observable<string> {
    return from(Device.getId()).pipe(map(info => info.uuid));
  }
}

import { Injectable } from '@angular/core';
import { Observable, of as obsOf } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';

import { LoginBroker } from 'app/common/login-broker';
import { StorageService } from 'app/services/storage/storage.service';

@Injectable()
export class ClientDataService {

  private static readonly BROKER_LIST: string = 'BrokerList';
  private static readonly SESSION_DATA: string = 'SessionData';
  private static readonly CLIENT_ID: string = 'ClientId';

  constructor(private storageService: StorageService) { }

  public loadBrokerList(): Observable<Array<LoginBroker>> {
    return this.storageService.loadData(ClientDataService.BROKER_LIST).pipe(
      map(brokerListStr => JSON.parse(brokerListStr))
    );
  }

  public saveBrokerList(brokerList: Array<LoginBroker>): Observable<boolean> {
    return this.storageService.saveData(ClientDataService.BROKER_LIST, JSON.stringify(brokerList));
  }

  public loadSessionData(): Observable<string> {
    return this.storageService.loadData(ClientDataService.SESSION_DATA);
  }

  public saveSessionData(sessionData: string): Observable<boolean> {
    return this.storageService.saveData(ClientDataService.SESSION_DATA, sessionData);
  }

  public deleteSessionData(): Observable<boolean> {
    return this.storageService.delete(ClientDataService.SESSION_DATA);
  }

  public getDeviceUuid(): Observable<string> {
    const device: any = (window as any).device;
    if (device && !String.isNullOrWhiteSpace(device.uuid)) {
      return obsOf(device.uuid);
    } else {
      return this.storageService.loadData(ClientDataService.CLIENT_ID).pipe(
        map(clientId => {
          if (String.isNullOrWhiteSpace(clientId)) {
            const newClientId = this.generateUuid();
            return this.storageService.saveData(ClientDataService.CLIENT_ID, newClientId).pipe(
              map(saved => newClientId)
            );
          } else {
            return obsOf(clientId);
          }
        }),
        flatMap(clientId => clientId)
      );
    }
  }

  private generateUuid(): string {
    const lut = [];

    for (let i = 0; i < 256; i++) {
      lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
    }

    const d0 = Math.random() * 0xFFFFFFFF | 0;
    const d1 = Math.random() * 0xFFFFFFFF | 0;
    const d2 = Math.random() * 0xFFFFFFFF | 0;
    const d3 = Math.random() * 0xFFFFFFFF | 0;

    return lut[d0 & 0xFF] + lut[d0 >> 8 & 0xFF] + lut[d0 >> 16 & 0xFF] + lut[d0 >> 24 & 0xFF] + '-' +
      lut[d1 & 0xFF] + lut[d1 >> 8 & 0xFF] + '-' + lut[d1 >> 16 & 0x0F | 0x40] + lut[d1 >> 24 & 0xFF] + '-' +
      lut[d2 & 0x3F | 0x80] + lut[d2 >> 8 & 0xFF] + '-' + lut[d2 >> 16 & 0xFF] + lut[d2 >> 24 & 0xFF] +
      lut[d3 & 0xFF] + lut[d3 >> 8 & 0xFF] + lut[d3 >> 16 & 0xFF] + lut[d3 >> 24 & 0xFF];
  }
}

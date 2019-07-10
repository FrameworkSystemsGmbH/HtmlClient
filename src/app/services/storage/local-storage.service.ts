import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { StorageService } from 'app/services/storage/storage.service';

@Injectable()
export class LocalStorageService extends StorageService {

  public loadData(key: string): Observable<string> {
    return new Observable<string>(subscriber => {
      try {
        if (!String.isNullOrWhiteSpace(key) && window.localStorage) {
          subscriber.next(window.localStorage.getItem(key));
        }
        subscriber.complete();
      } catch (error) {
        subscriber.error(error);
      }
    });
  }

  public saveData(key: string, value: string): Observable<boolean> {
    return new Observable<boolean>(subscriber => {
      try {
        if (!String.isNullOrWhiteSpace(key) && window.localStorage) {
          if (!String.isNullOrWhiteSpace(value)) {
            window.localStorage.setItem(key, value);
          } else {
            window.localStorage.removeItem(key);
          }
          subscriber.next(true);
        } else {
          subscriber.next(false);
        }
        subscriber.complete();
      } catch (error) {
        subscriber.error(error);
      }
    });
  }

  public delete(key: string): Observable<boolean> {
    return new Observable<boolean>(subscriber => {
      try {
        if (!String.isNullOrWhiteSpace(key) && window.localStorage) {
          window.localStorage.removeItem(key);
          subscriber.next(true);
        } else {
          subscriber.next(false);
        }
        subscriber.complete();
      } catch (error) {
        subscriber.error(error);
      }
    });
  }
}

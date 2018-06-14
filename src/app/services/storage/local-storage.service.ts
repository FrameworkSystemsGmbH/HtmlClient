import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

import { StorageService } from 'app/services/storage/storage.service';

@Injectable()
export class LocalStorageService extends StorageService {

  public loadData(key: string): Observable<string> {
    return Observable.create((observer: Observer<string>) => {
      try {
        if (!String.isNullOrWhiteSpace(key) && window.localStorage) {
          observer.next(window.localStorage.getItem(key));
        }
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }

  public saveData(key: string, value: string): Observable<boolean> {
    return Observable.create((observer: Observer<boolean>) => {
      try {
        if (!String.isNullOrWhiteSpace(key) && window.localStorage) {
          if (!String.isNullOrWhiteSpace(value)) {
            window.localStorage.setItem(key, value);
          } else {
            window.localStorage.removeItem(key);
          }
          observer.next(true);
        } else {
          observer.next(false);
        }
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }

  public delete(key: string): Observable<boolean> {
    return Observable.create((observer: Observer<boolean>) => {
      try {
        if (!String.isNullOrWhiteSpace(key) && window.localStorage) {
          window.localStorage.removeItem(key);
          observer.next(true);
        } else {
          observer.next(false);
        }
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }
}

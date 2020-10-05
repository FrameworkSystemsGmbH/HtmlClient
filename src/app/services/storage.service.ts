import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const { Storage } = Plugins;

@Injectable()
export abstract class StorageService {

  public load(key: string): Observable<string> {
    return from(Storage.get({ key })).pipe(map(obj => obj.value));
  }

  public save(key: string, value: string): Observable<void> {
    return from(Storage.set({ key, value }));
  }

  public delete(key: string): Observable<void> {
    return from(Storage.remove({ key }));
  }
}

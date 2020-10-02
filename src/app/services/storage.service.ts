import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';
import { Injectable } from "@angular/core";

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

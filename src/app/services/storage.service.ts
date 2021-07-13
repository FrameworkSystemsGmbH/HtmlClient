import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { from, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export abstract class StorageService {

  public load(key: string): Observable<string | null> {
    return from(Storage.migrate()).pipe(
      mergeMap(() => from(Storage.get({ key })).pipe(
        map(obj => obj.value)
      ))
    );
  }

  public save(key: string, value: string): Observable<void> {
    return from(Storage.set({ key, value }));
  }

  public delete(key: string): Observable<void> {
    return from(Storage.remove({ key }));
  }
}

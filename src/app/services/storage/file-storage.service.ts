import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { from, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FileStorageService {

  public load(key: string): Observable<string | null> {
    return from(Preferences.migrate()).pipe(
      mergeMap(() => from(Preferences.get({ key })).pipe(
        map(obj => obj.value)
      ))
    );
  }

  public save(key: string, value: string): Observable<void> {
    return from(Preferences.set({ key, value }));
  }

  public delete(key: string): Observable<void> {
    return from(Preferences.remove({ key }));
  }
}

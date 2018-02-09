import { Injectable } from '@angular/core';

import { StorageService } from 'app/services/storage.service';

@Injectable()
export class LocalStorageService extends StorageService {

  public saveData(key: string, value: string): void {
    if (!key || !window.localStorage) { return; }
    window.localStorage.setItem(key, value);
  }

  public loadData(key: string): string {
    if (!key || !window.localStorage) { return null; }
    return window.localStorage.getItem(key);
  }
}

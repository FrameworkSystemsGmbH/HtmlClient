import { Injectable } from '@angular/core';

import { StorageService } from './storage.service';
import { WindowRefService } from './windowref.service';


@Injectable()
export class LocalStorageService extends StorageService {

  private window: Window;

  constructor(private windowRef: WindowRefService) {
    super();
    this.window = this.windowRef.nativeWindow;
  }

  public saveData(key: string, value: string): void {
    if (!key || !this.window.localStorage) { return; }
    this.window.localStorage.setItem(key, value);
  }

  public loadData(key: string): string {
    if (!key || !this.window.localStorage) { return undefined; }
    return this.window.localStorage.getItem(key);
  }
}

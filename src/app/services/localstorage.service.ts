import { Injectable } from '@angular/core';

import { IStorageService } from './storage.service';
import { WindowRefService } from './windowref.service';

@Injectable()
export class LocalStorageService implements IStorageService {

  private _window: Window;

  constructor(private _windowRef: WindowRefService) {
    this._window = this._windowRef.nativeWindow;
  }

  public saveData(key: string, value: string): void {
    if (!key || !this._window.localStorage) { return; }
    this._window.localStorage.setItem(key, value);
  }

  public loadData(key: string): string {
    if (!key || !this._window.localStorage) { return undefined; }
    return this._window.localStorage.getItem(key);
  }
}

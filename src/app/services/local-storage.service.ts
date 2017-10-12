import { Injectable } from '@angular/core';

import { NativeService } from './native.service';
import { StorageService } from './storage.service';


@Injectable()
export class LocalStorageService extends StorageService {

  private _window: Window;

  constructor(private nativeService: NativeService) {
    super();
    this._window = this.nativeService.window;
  }

  public saveData(key: string, value: string): void {
    if (!key || !this._window.localStorage) { return; }
    this._window.localStorage.setItem(key, value);
  }

  public loadData(key: string): string {
    if (!key || !this._window.localStorage) { return null; }
    return this._window.localStorage.getItem(key);
  }
}

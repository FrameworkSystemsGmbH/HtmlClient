/// <reference types="cordova-plugin-inappbrowser" />

import { Injectable } from '@angular/core';
import { PlatformService } from 'app/services/platform/platform.service';

@Injectable()
export class ViewDocService {

  private _registered: boolean = false;

  private _target: string;

  constructor(private _platformService: PlatformService) {
    this._target = this._platformService.isMobile() ? '_system' : '_blank';
  }

  public viewDocument(url: string): void {
    if (!String.isNullOrWhiteSpace(url)) {
      window.open(url, this._target);
    }
  }

  public registerWindowOpen(): void {
    if (!this._registered && this._platformService.isMobile()) {
      window.open = (window as any).cordova.InAppBrowser.open;
      this._registered = true;
    }
  }
}

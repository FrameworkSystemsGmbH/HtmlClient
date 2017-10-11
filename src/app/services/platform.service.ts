import { Injectable } from '@angular/core';

import { WindowRefService } from './windowref.service';

@Injectable()
export class PlatformService {
  private _isMobile: boolean;
  private _isDesktop: boolean;
  private _isWeb: boolean;

  constructor(private windowRefService: WindowRefService) {
    this.guessPlatform();
  }

  public get isMobile(): boolean {
    return this._isMobile;
  }

  public get isDesktop(): boolean {
    return this._isDesktop;
  }

  public get isWeb(): boolean {
    return this._isWeb;
  }

  private guessPlatform(): void {
    this._isMobile = !!this.windowRefService.nativeWindow.cordova;
    this._isDesktop = this.windowRefService.nativeWindow.navigator.userAgent.match(/Electron/) !== null;
    this._isWeb = !(this._isMobile || this._isDesktop);
  }
}

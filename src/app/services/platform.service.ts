import { Injectable } from '@angular/core';

@Injectable()
export class PlatformService {

  private _isMobile: boolean;
  private _isDesktop: boolean;
  private _isWeb: boolean;

  private _isAndroid: boolean;
  private _isIos: boolean;

  private _isIE: boolean;

  constructor() {
    this.guessPlatform();
  }

  public isMobile(): boolean {
    return this._isMobile;
  }

  public isDesktop(): boolean {
    return this._isDesktop;
  }

  public isWeb(): boolean {
    return this._isWeb;
  }

  public isAndroid(): boolean {
    return this._isAndroid;
  }

  public isIos(): boolean {
    return this._isIos;
  }

  public isIE(): boolean {
    return this._isIE;
  }

  private guessPlatform(): void {
    const userAgent: string = window.navigator.userAgent;

    this._isMobile = !!window.cordova;
    this._isDesktop = userAgent.match(/Electron/) !== null;
    this._isWeb = !(this._isMobile || this._isDesktop);

    this._isAndroid = this._isMobile && userAgent.match(/Android/) !== null;
    this._isIos = this._isMobile && (userAgent.match(/iPhone/) !== null || userAgent.match(/iPad/) !== null);

    this._isIE = userAgent.match(/Trident/) !== null;
  }
}

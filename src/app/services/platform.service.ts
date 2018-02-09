import { Injectable } from '@angular/core';

export interface IPlatformService {
  isMobile(): boolean;
  isDesktop(): boolean;
  isWeb(): boolean;
  isAndroid();
  isIos(): boolean;
}

@Injectable()
export class PlatformService {

  private _isMobile: boolean;
  private _isDesktop: boolean;
  private _isWeb: boolean;

  private _isAndroid: boolean;
  private _isIos: boolean;

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

  private guessPlatform(): void {
    const userAgent: string = window.navigator.userAgent;

    this._isMobile = !!window.cordova;
    this._isDesktop = userAgent.match(/Electron/) !== null;
    this._isWeb = !(this._isMobile || this._isDesktop);

    this._isAndroid = this._isMobile && userAgent.match(/Android/) !== null;
    this._isIos = this._isMobile && (userAgent.match(/iPhone/) !== null || userAgent.match(/iPad/) !== null);
  }
}

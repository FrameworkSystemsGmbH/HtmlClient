import { Injectable } from '@angular/core';

import { NativeService } from 'app/services/native.service';

@Injectable()
export class PlatformService {

  private _isMobile: boolean;
  private _isDesktop: boolean;
  private _isWeb: boolean;

  private _isAndroid: boolean;
  private _isIos: boolean;

  constructor(private nativeService: NativeService) {
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

  public get isAndroid(): boolean {
    return this._isAndroid;
  }

  public get isIos(): boolean {
    return this._isIos;
  }

  private guessPlatform(): void {
    const userAgent: string = this.nativeService.window.navigator.userAgent;

    this._isMobile = !!window.cordova;
    this._isDesktop = userAgent.match(/Electron/) !== null;
    this._isWeb = !(this._isMobile || this._isDesktop);

    this._isAndroid = this._isMobile && userAgent.match(/Android/) !== null;
    this._isIos = this._isMobile && (userAgent.match(/iPhone/) !== null || userAgent.match(/iPad/) !== null);
  }
}

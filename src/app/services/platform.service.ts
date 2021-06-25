import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';

@Injectable()
export class PlatformService {

  private _isNative: boolean;
  private _isAndroid: boolean;
  private _isIos: boolean;

  private _os: string;
  private _osVersion: string;

  public constructor() {
    this._isNative = Capacitor.isNative;
    this._isAndroid = Capacitor.getPlatform() === 'android';
    this._isIos = Capacitor.getPlatform() === 'ios';
    this._os = this.initOS();
    this._osVersion = navigator.userAgent;
  }

  public isNative(): boolean {
    return this._isNative;
  }

  public isAndroid(): boolean {
    return this._isAndroid;
  }

  public isIos(): boolean {
    return this._isIos;
  }

  public getOS(): string {
    return this._os;
  }

  public getOSVersion(): string {
    return this._osVersion;
  }

  private initOS(): string {
    if (this._isNative) {
      if (this._isAndroid) {
        return 'Android';
      } else if (this._isIos) {
        return 'iOS';
      }
    } else {
      const agent: string = navigator.userAgent.toLowerCase();

      if (agent.match(/iris/) !== null) {
        return 'Windows Mobile';
      } else if (agent.match(/windows phone/) !== null) {
        return 'Windows Phone';
      } else if (agent.match(/windows nt/) !== null) {
        return 'Windows';
      } else if (agent.match(/cros/) !== null) {
        return 'ChromeOS';
      } else if (agent.match(/freebsd/) !== null) {
        return 'FreeBSD';
      } else if (agent.match(/mac/) !== null) {
        return 'Mac';
      } else if (agent.match(/iphone/) !== null) {
        return 'iOS';
      } else if (agent.match(/ipad/) !== null) {
        return 'iOS';
      } else if (agent.match(/blackberry/) !== null) {
        return 'BlackBerry';
      } else if (agent.match(/android/) !== null) {
        return 'Android';
      } else if (agent.match(/linux/) !== null) {
        return 'Linux';
      }
    }

    return 'Unknown';
  }
}

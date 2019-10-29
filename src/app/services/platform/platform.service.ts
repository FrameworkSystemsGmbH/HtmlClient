import { Injectable } from '@angular/core';
import { ClientPlatform } from 'app/enums/client-platform';

@Injectable()
export abstract class PlatformService {

  public abstract getPlatform(): ClientPlatform;

  public abstract getOS(): string;

  public abstract getOSVersion(): string;

  public isMobile(): boolean {
    return this.getPlatform() === ClientPlatform.Mobile;
  }

  public isDesktop(): boolean {
    return this.getPlatform() === ClientPlatform.Desktop;
  }

  public isWeb(): boolean {
    return this.getPlatform() === ClientPlatform.Web;
  }

  public isAndroid(): boolean {
    return this.getPlatform() === ClientPlatform.Mobile && navigator.userAgent.match(/Android/) !== null;
  }

  public isIos(): boolean {
    return this.getPlatform() === ClientPlatform.Mobile && (navigator.userAgent.match(/iPhone/) !== null || navigator.userAgent.match(/iPad/) !== null);
  }
}

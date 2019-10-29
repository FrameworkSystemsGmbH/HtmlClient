import { PlatformService } from 'app/services/platform/platform.service';
import { Injectable } from '@angular/core';
import { ClientPlatform } from 'app/enums/client-platform';

@Injectable()
export class WebPlatformService extends PlatformService {

  public getPlatform(): ClientPlatform {
    return ClientPlatform.Web;
  }

  public getOS(): string {
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
    } else {
      return 'Unknown';
    }
  }

  public getOSVersion(): string {
    return navigator.userAgent;
  }
}

/// <reference types="cordova-plugin-device" />

import { PlatformService } from 'app/services/platform/platform.service';
import { Injectable } from '@angular/core';
import { ClientPlatform } from 'app/enums/client-platform';

@Injectable()
export class MobilePlatformService extends PlatformService {

  public getPlatform(): ClientPlatform {
    return ClientPlatform.Mobile;
  }

  public getOS(): string {
    const platform: string = device.platform.toLowerCase();

    if (platform.match(/android/) !== null) {
      return 'Android';
    } else if (platform.match(/ios/) !== null) {
      return 'iOS';
    } else {
      return 'Unknown';
    }
  }

  public getOSVersion(): string {
    return navigator.userAgent;
  }
}

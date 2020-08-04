/// <reference types="cordova-plugin-statusbar" />

import { Injectable } from '@angular/core';

import { PlatformService } from 'app/services/platform.service';

@Injectable()
export class StatusBarService {

  constructor(private platformService: PlatformService) { }

  public hideStatusBar(): void {
    if (this.platformService.isAndroid()) {
      StatusBar.hide();
      (window as any).navigationbar.hideNavigationBar();
    }
  }
}

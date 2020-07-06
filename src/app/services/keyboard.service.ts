/// <reference types="cordova-plugin-statusbar" />

import { Injectable } from '@angular/core';

import { PlatformService } from 'app/services/platform/platform.service';
import { StatusBarService } from 'app/services/statusbar.service';

import * as DomUtil from 'app/util/dom-util';

@Injectable()
export class KeyboardService {

  constructor(
    private platformService: PlatformService,
    private statusBarService: StatusBarService
  ) { }

  public attachScrollHandler(): void {
    if (this.platformService.isAndroid()) {
      window.addEventListener('keyboardDidShow', this.scrollToFocusOnOpen.bind(this), false);
      window.addEventListener('keyboardDidHide', this.hideStatusBar.bind(this), false);
    }
  }

  private hideStatusBar(): void {
    this.statusBarService.hideStatusBar();
  }

  private scrollToFocusOnOpen(): void {
    if (document.activeElement) {
      const activeHtmlElement: HTMLElement = document.activeElement as HTMLElement;
      const scroller: HTMLElement = DomUtil.getNearestParent(activeHtmlElement, 'hc-form-scroller');
      if (activeHtmlElement != null && scroller != null) {
        DomUtil.scrollIntoView(scroller, activeHtmlElement);
      }
    }
  }
}

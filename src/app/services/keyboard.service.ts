import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';

import { PlatformService } from 'app/services/platform.service';

import * as DomUtil from 'app/util/dom-util';

const { Keyboard } = Plugins;

@Injectable()
export class KeyboardService {

  constructor(private platformService: PlatformService) { }

  public attachScrollHandler(): void {
    if (this.platformService.isAndroid()) {
      Keyboard.addListener('keyboardDidShow', this.scrollToFocusOnOpen.bind(this));
    }
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

import { Injectable } from '@angular/core';

import { PlatformService } from 'app/services/platform.service';
import { DomUtil } from 'app/util/dom-util';

@Injectable()
export class KeyboardService {

  constructor(private platformService: PlatformService) { }

  public attachScrollHandler(): void {
    if (this.platformService.isAndroid) {
      window.addEventListener('keyboardDidShow', this.scrollToFocusOnOpen.bind(this), false);
    }
  }

  private scrollToFocusOnOpen(event: any): void {
    if (document.activeElement) {
      const activeHtmlElement: HTMLElement = document.activeElement as HTMLElement;
      const scroller: HTMLElement = DomUtil.getNearestParent(activeHtmlElement, 'hc-form-scroller');
      if (activeHtmlElement != null && scroller != null) {
        DomUtil.scrollIntoView(scroller, activeHtmlElement);
      }
    }
  }
}

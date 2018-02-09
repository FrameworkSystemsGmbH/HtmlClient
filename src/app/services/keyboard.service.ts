import { Injectable } from '@angular/core';

import { PlatformService } from 'app/services/platform.service';
import { DomUtil } from 'app/util/dom-util';

@Injectable()
export class KeyboardService {

  constructor(private platformService: PlatformService) { }

  public attachScrollHandler(): void {
    if (this.platformService.isAndroid) {
      window.addEventListener('keyboardDidShow', this.scrollToFocusOnOpen.bind(this));
    }
  }

  private scrollToFocusOnOpen(event: any): void {
    if (document.activeElement) {
      DomUtil.scrollIntoView(document.body, document.activeElement as HTMLElement);
    }
  }
}

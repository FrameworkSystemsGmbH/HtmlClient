import { Injectable } from '@angular/core';
import { PlatformService } from '@app/services/platform.service';
import * as DomUtil from '@app/util/dom-util';
import { Plugins } from '@capacitor/core';

const { Keyboard } = Plugins;

@Injectable({ providedIn: 'root' })
export class KeyboardService {

  private readonly _platformService: PlatformService;

  public constructor(platformService: PlatformService) {
    this._platformService = platformService;
  }

  public attachScrollHandler(): void {
    if (this._platformService.isAndroid()) {
      Keyboard.addListener('keyboardDidShow', this.scrollToFocusOnOpen.bind(this));
    }
  }

  private scrollToFocusOnOpen(): void {
    if (document.activeElement) {
      const activeHtmlElement: HTMLElement = document.activeElement as HTMLElement;
      const scroller: HTMLElement | null = DomUtil.getNearestParent(activeHtmlElement, 'hc-form-scroller');
      if (activeHtmlElement != null && scroller != null) {
        DomUtil.scrollIntoView(scroller, activeHtmlElement);
      }
    }
  }
}

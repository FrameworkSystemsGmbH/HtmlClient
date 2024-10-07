import { Injectable, NgZone } from '@angular/core';
import { PlatformService } from '@app/services/platform.service';
import * as DomUtil from '@app/util/dom-util';
import { Keyboard } from '@capacitor/keyboard';
import { from, Subscription } from 'rxjs';

/** Sobald Keyboard am Phone angezeigt wird, wird Resize und ScrollToFocus
 * über KeyboardService gemanaged. Alles rutscht nach oben, die WebView wird kleiner
 * und zur Textbox muss evtl. hingescrolled werden, automatisch.
 */
@Injectable({ providedIn: 'root' })
export class KeyboardService {

  private readonly _zone: NgZone;
  private readonly _platformService: PlatformService;

  private _listenerSub: Subscription | null = null;

  public constructor(
    zone: NgZone,
    platformService: PlatformService
  ) {
    this._zone = zone;
    this._platformService = platformService;
  }

  public attachHandlers(): void {
    if (this._platformService.isAndroid() && this._listenerSub == null) {
      this._listenerSub = from(Keyboard.addListener('keyboardDidShow', this.scrollToFocusOnOpen.bind(this))).subscribe({
        error: (err) => {
        this._zone.run(() => {
          throw Error.ensureError(err);
        });
      }});
    }
  }

  public removeHandlers(): void {
    if (this._platformService.isAndroid()) {
      this._listenerSub?.unsubscribe();
      this._listenerSub = null;
    }
  }

  private scrollToFocusOnOpen(): void {
    if (document.activeElement) {
      const activeHtmlElement: HTMLElement | null = document.activeElement as HTMLElement | null;
      if (activeHtmlElement != null) {
        const scroller: HTMLElement | null = DomUtil.getNearestParent(activeHtmlElement, 'hc-form-scroller');
        if (scroller != null) {
          DomUtil.scrollIntoView(scroller, activeHtmlElement);
        }
      }
    }
  }
}

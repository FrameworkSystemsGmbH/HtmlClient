import { Injectable } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';

/** Zwei gewisse Gestures werden deaktiviert:
 * Pinch: Zwei Finger Zoom-in Zoom-out
 * Rotate: Zwei Finger werden gedreht/rotate
 */
@Injectable({ providedIn: 'root' })
export class HammerConfig extends HammerGestureConfig {
  public overrides: any = {
    'pinch': { enable: false },
    'rotate': { enable: false }
  };
}

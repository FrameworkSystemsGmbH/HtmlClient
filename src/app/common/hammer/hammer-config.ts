import { HammerGestureConfig } from '@angular/platform-browser';

export class HammerConfig extends HammerGestureConfig {
  overrides: any = <any>{
    'pinch': { enable: false },
    'rotate': { enable: false }
  };
}

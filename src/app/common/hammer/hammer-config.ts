import { Injectable } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';

@Injectable()
export class HammerConfig extends HammerGestureConfig {
  public overrides: any = {
    'pinch': { enable: false },
    'rotate': { enable: false }
  };
}

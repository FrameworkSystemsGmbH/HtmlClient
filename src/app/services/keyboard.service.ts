import { Injectable } from '@angular/core';
import { NativeService } from './native.service';
import { PlatformService } from './platform.service';

@Injectable()
export class KeyboardService {

  constructor(
    private nativeService: NativeService,
    private platformService: PlatformService) { }

  public attachScrollHandler(): void {
    if (this.platformService.isAndroid) {
      this.nativeService.window.addEventListener('native.keyboardshow', this.scrollToFocusOnOpen.bind(this));
    }
  }

  private scrollToFocusOnOpen(event: any): void {
    if (document.activeElement) {
      document.activeElement.scrollIntoView(false);
    }
  }
}

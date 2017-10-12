import { Component, HostListener } from '@angular/core';

import { FocusService } from './services/focus.service';
import { KeyboardService } from './services/keyboard.service';
import { LocaleService } from './services/locale.service';

@Component({
  selector: 'hc-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private focusService: FocusService,
    private localeService: LocaleService,
    private keyboardService: KeyboardService
  ) {
    this.localeService.setMomentLocaleGlobally();
    this.keyboardService.attachScrollHandler();
  }

  @HostListener('window:keydown', ['$event'])
  public globalKeyDown(event: any): void {
    this.focusService.setLastKeyEvent(event);
  }

  @HostListener('window:mousedown', ['$event'])
  public globalMouseDown(event: any): void {
    this.focusService.setLastMouseEvent(event);
  }
}

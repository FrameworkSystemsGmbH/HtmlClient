import { Component, HostListener } from '@angular/core';

import { FocusService } from './services/focus.service';
import { LocaleService } from './services/locale.service';

@Component({
  selector: 'hc-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private focusService: FocusService,
    private localeService: LocaleService
  ) {
    this.localeService.setMomentLocaleGlobally();
  }

  @HostListener('window:keydown', ['$event'])
  public globalKeyDown(event: any): void {
    this.focusService.setLastKeyEvent(event);
  }

  @HostListener('window:mousedown', ['$event'])
  public globalMouseDown(event: any): void {
    this.focusService.setLastMouseEvent(event);
  }

  @HostListener('window:native.keyboardshow', ['$event'])
  public showKeyboard(event: any): void {
    if (document.activeElement) {
      document.activeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

import { Component, HostListener } from '@angular/core';

import { FocusService } from 'app/services/focus.service';
import { LocaleService } from 'app/services/locale.service';
import { KeyboardService } from 'app/services/keyboard.service';
import { SerializeService } from './services/serialize.service';

@Component({
  selector: 'hc-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private focusService: FocusService,
    private localeService: LocaleService,
    private keyboardService: KeyboardService,
    private serializeService: SerializeService
  ) {
    this.localeService.setMomentLocaleGlobally();
    this.keyboardService.attachScrollHandler();
    this.serializeService.attachHandlers();
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

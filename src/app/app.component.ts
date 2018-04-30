import { Component, HostListener, OnInit } from '@angular/core';

import { FocusService } from 'app/services/focus.service';
import { LocaleService } from 'app/services/locale.service';
import { KeyboardService } from 'app/services/keyboard.service';
import { PlatformService } from 'app/services/platform.service';
import { SerializeService } from './services/serialize.service';

@Component({
  selector: 'hc-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public style: any;

  constructor(
    private focusService: FocusService,
    private localeService: LocaleService,
    private keyboardService: KeyboardService,
    private platformService: PlatformService,
    private serializeService: SerializeService
  ) {
    this.localeService.setMomentLocaleGlobally();
    this.keyboardService.attachScrollHandler();
    this.serializeService.attachHandlers();
  }

  public ngOnInit(): void {
    if (this.platformService.isIos()) {
      this.style = this.createIosStyle();
    }
  }

  private createIosStyle(): any {
    return {
      'padding-top.px': 20
    };
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

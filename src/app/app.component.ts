import { Component, HostListener, OnInit } from '@angular/core';

import { FocusService } from 'app/services/focus.service';
import { LocaleService } from 'app/services/locale.service';
import { HardwareService } from 'app/services/hardware-service';
import { KeyboardService } from 'app/services/keyboard.service';
import { PlatformService } from 'app/services/platform.service';
import { SerializeService } from 'app/services/serialize.service';
import { StyleUtil } from 'app/util/style-util';

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
    private hardwareService: HardwareService,
    private keyboardService: KeyboardService,
    private platformService: PlatformService,
    private serializeService: SerializeService
  ) {
    this.localeService.setMomentLocaleGlobally();
    this.hardwareService.attachHandlers();
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
      'padding-top.px': StyleUtil.iosMenubarHeight
    };
  }

  @HostListener('window:keydown', ['$event'])
  public globalKeyDown(event: KeyboardEvent): void {
    this.focusService.setLastKeyEvent(event);
  }

  @HostListener('window:mousedown', ['$event'])
  public globalMouseDown(event: MouseEvent): void {
    this.focusService.setLastMouseEvent(event);
  }
}

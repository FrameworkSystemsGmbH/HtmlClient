import { Component, HostListener, OnInit } from '@angular/core';

import { FocusService } from 'app/services/focus.service';
import { LocaleService } from 'app/services/locale.service';
import { BackService } from 'app/services/back-service';
import { KeyboardService } from 'app/services/keyboard.service';
import { PlatformService } from 'app/services/platform/platform.service';
import { StateService } from 'app/services/state.service';
import { ViewDocService } from 'app/services/actions/viewdoc.service';

import * as StyleUtil from 'app/util/style-util';

@Component({
  selector: 'hc-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public style: any;

  constructor(
    private backService: BackService,
    private focusService: FocusService,
    private localeService: LocaleService,
    private keyboardService: KeyboardService,
    private platformService: PlatformService,
    private serializeService: StateService,
    private viewDocService: ViewDocService
  ) {
    this.backService.attachHandlers();
    this.localeService.setMomentLocaleGlobally();
    this.keyboardService.attachScrollHandler();
    this.serializeService.attachHandlers();
    this.viewDocService.registerWindowOpen();
  }

  public ngOnInit(): void {
    if (this.platformService.isIos()) {
      this.style = this.createIosStyle();
    }
  }

  private createIosStyle(): any {
    return {
      'padding-top.rem': StyleUtil.pixToRem(StyleUtil.iosMenubarHeight)
    };
  }

  @HostListener('window:mousedown', ['$event'])
  public globalMouseDown(event: MouseEvent): void {
    this.focusService.setLastMouseEvent(event);
  }
}

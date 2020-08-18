import { Component, HostListener, OnInit, AfterViewInit } from '@angular/core';
import { Plugins } from '@capacitor/core';

import { BackService } from 'app/services/back-service';
import { FocusService } from 'app/services/focus.service';
import { LocaleService } from 'app/services/locale.service';
import { KeyboardService } from 'app/services/keyboard.service';
import { PlatformService } from 'app/services/platform.service';
import { StateService } from 'app/services/state.service';

import * as StyleUtil from 'app/util/style-util';

const { SplashScreen } = Plugins;

@Component({
  selector: 'hc-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  public ready: boolean;
  public style: any;

  constructor(
    private backService: BackService,
    private focusService: FocusService,
    private localeService: LocaleService,
    private keyboardService: KeyboardService,
    private platformService: PlatformService,
    private stateService: StateService
  ) {
    this.backService.attachHandlers();
    this.localeService.setMomentLocaleGlobally();
    this.keyboardService.attachScrollHandler();
    this.stateService.attachHandlers();
  }

  public ngOnInit(): void {
    this.stateService.resumeLastSession().subscribe(() => this.ready = true);

    if (this.platformService.isIos()) {
      this.style = this.createIosStyle();
    }
  }

  public ngAfterViewInit(): void {
    SplashScreen.hide({ fadeOutDuration: 500 });
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

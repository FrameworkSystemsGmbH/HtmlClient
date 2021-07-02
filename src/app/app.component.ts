import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { BackService } from '@app/services/back-service';
import { DeepLinkService } from '@app/services/deep-link.service';
import { FocusService } from '@app/services/focus.service';
import { KeyboardService } from '@app/services/keyboard.service';
import { LocaleService } from '@app/services/locale.service';
import { PlatformService } from '@app/services/platform.service';
import { StateService } from '@app/services/state.service';
import { IAppState } from '@app/store/app.state';
import { setReady } from '@app/store/ready/ready.actions';
import { selectReady } from '@app/store/ready/ready.selectors';
import * as StyleUtil from '@app/util/style-util';
import { Plugins } from '@capacitor/core';
import { Store } from '@ngrx/store';

const { SplashScreen } = Plugins;

@Component({
  selector: 'hc-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  public style: any;
  public ready: boolean = false;

  private readonly _focusService: FocusService;
  private readonly _platformService: PlatformService;
  private readonly _stateService: StateService;
  private readonly _store: Store<IAppState>;

  public constructor(
    backService: BackService,
    deepLinkService: DeepLinkService,
    focusService: FocusService,
    localeService: LocaleService,
    keyboardService: KeyboardService,
    platformService: PlatformService,
    stateService: StateService,
    store: Store<IAppState>
  ) {
    this._focusService = focusService;
    this._platformService = platformService;
    this._stateService = stateService;
    this._store = store;

    backService.attachHandlers();
    deepLinkService.attachHandlers();
    localeService.setMomentLocaleGlobally();
    keyboardService.attachScrollHandler();
    stateService.attachHandlers();
  }

  @HostListener('window:mousedown', ['$event'])
  public globalMouseDown(event: MouseEvent): void {
    this._focusService.setLastMouseEvent(event);
  }

  public ngOnInit(): void {
    this._store.select(selectReady).subscribe((ready: boolean) => {
      this.ready = ready;
    });

    this._stateService.resumeLastSession().subscribe(() => this._store.dispatch(setReady({ ready: true })));

    if (this._platformService.isIos()) {
      this.style = this.createIosStyle();
    }
  }

  public ngAfterViewInit(): void {
    void SplashScreen.hide({ fadeOutDuration: 500 });
  }

  private createIosStyle(): any {
    return {
      'padding-top.rem': StyleUtil.pixToRem(StyleUtil.iosMenubarHeight)
    };
  }
}

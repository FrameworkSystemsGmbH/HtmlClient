import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
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
import { SplashScreen } from '@capacitor/splash-screen';
import { Store } from '@ngrx/store';

@Component({
  standalone: true,
  selector: 'hc-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  public style: any;
  public ready: boolean = false;

  private readonly _backService: BackService;
  private readonly _deepLinkService: DeepLinkService;
  private readonly _focusService: FocusService;
  private readonly _localeService: LocaleService;
  private readonly _keyboardService: KeyboardService;
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
    this._backService = backService;
    this._deepLinkService = deepLinkService;
    this._focusService = focusService;
    this._localeService = localeService;
    this._keyboardService = keyboardService;
    this._platformService = platformService;
    this._stateService = stateService;
    this._store = store;

    this._backService.attachHandlers();
    this._deepLinkService.attachHandlers();
    this._localeService.setMomentLocaleGlobally();
    this._keyboardService.attachHandlers();
    this._stateService.attachHandlers();
  }

  @HostListener('window:mousedown', ['$event'])
  public globalMouseDown(event: MouseEvent): void {
    this._focusService.setLastMouseEvent(event);
  }

  public ngOnInit(): void {
    if (this._platformService.isIos()) {
      this.style = this.createIosStyle();
    }

    this._store.select(selectReady).subscribe((ready: boolean) => {
      this.ready = ready;
    });

    this._stateService.resumeLastSession();

    this._store.dispatch(setReady({ ready: true }));
  }

  public ngAfterViewInit(): void {
    void SplashScreen.hide({ fadeOutDuration: 500 });
  }

  public ngOnDestroy(): void {
    this._backService.removeHandlers();
    this._deepLinkService.removeHandlers();
    this._keyboardService.removeHandlers();
    this._stateService.removeHandlers();
  }

  private createIosStyle(): any {
    return {
      'padding-top.rem': StyleUtil.pixToRem(StyleUtil.iosMenubarHeight)
    };
  }
}

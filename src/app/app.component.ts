import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
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
import { Subscription } from 'rxjs';

@Component({
    selector: 'hc-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [
        CommonModule,
        RouterModule
    ]
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

  private _readySub: Subscription | null = null;

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
  //** Globaler MouseHandler, welche alle MouseDown events erhält und speichert*/
  @HostListener('window:mousedown', ['$event'])
  public globalMouseDown(event: MouseEvent): void {
    this._focusService.setLastMouseEvent(event);
  }

  public ngOnInit(): void {
    if (this._platformService.isIos()) {
      this.style = this.createIosStyle();
    }
    /* Ready-State wird aktualisiert*/
    this._readySub = this._store.select(selectReady).subscribe({
      next: (ready: boolean) => {
        this.ready = ready;
      }
    });

    this._stateService.resumeLastSession();

    this._store.dispatch(setReady({ ready: true }));
  }

  public ngAfterViewInit(): void {
    /* Sobald Component komplett geladen ist, wird SplashScreen entfernt. Dann flackert nichts beim Aufbau des HTMLs. */
    void SplashScreen.hide({ fadeOutDuration: 500 });
  }

  public ngOnDestroy(): void {
    this._backService.removeHandlers();
    this._deepLinkService.removeHandlers();
    this._keyboardService.removeHandlers();
    this._stateService.removeHandlers();

    this._readySub?.unsubscribe();
  }

  private createIosStyle(): any {
    return {
      'padding-top.rem': StyleUtil.pixToRem(StyleUtil.iosMenubarHeight)
    };
  }
}

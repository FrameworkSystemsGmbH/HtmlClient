import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { BackService } from '@app/services/back-service';
import { DeepLinkService } from '@app/services/deep-link.service';
import { FocusService } from '@app/services/focus.service';
import { KeyboardService } from '@app/services/keyboard.service';
import { LocaleService } from '@app/services/locale.service';
import { PlatformService } from '@app/services/platform.service';
import { StateService } from '@app/services/state.service';
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

  public ready: boolean;
  public style: any;

  public constructor(
    private readonly _backService: BackService,
    private readonly _deepLinkService: DeepLinkService,
    private readonly _focusService: FocusService,
    private readonly _localeService: LocaleService,
    private readonly _keyboardService: KeyboardService,
    private readonly _platformService: PlatformService,
    private readonly _stateService: StateService,
    private readonly _store: Store
  ) {
    this._backService.attachHandlers();
    this._deepLinkService.attachHandlers();
    this._localeService.setMomentLocaleGlobally();
    this._keyboardService.attachScrollHandler();
    this._stateService.attachHandlers();
  }

  @HostListener('window:mousedown', ['$event'])
  public globalMouseDown(event: MouseEvent): void {
    this._focusService.setLastMouseEvent(event);
  }

  public ngOnInit(): void {
    this._store.select(selectReady).subscribe(ready => {
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

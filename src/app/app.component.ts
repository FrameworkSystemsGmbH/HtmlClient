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
    private readonly backService: BackService,
    private readonly deepLinkService: DeepLinkService,
    private readonly focusService: FocusService,
    private readonly localeService: LocaleService,
    private readonly keyboardService: KeyboardService,
    private readonly platformService: PlatformService,
    private readonly stateService: StateService,
    private readonly store: Store
  ) {
    this.backService.attachHandlers();
    this.deepLinkService.attachHandlers();
    this.localeService.setMomentLocaleGlobally();
    this.keyboardService.attachScrollHandler();
    this.stateService.attachHandlers();
  }

  @HostListener('window:mousedown', ['$event'])
  public globalMouseDown(event: MouseEvent): void {
    this.focusService.setLastMouseEvent(event);
  }

  public ngOnInit(): void {
    this.store.select(selectReady).subscribe(ready => {
      this.ready = ready;
    });

    this.stateService.resumeLastSession().subscribe(() => this.store.dispatch(setReady({ ready: true })));

    if (this.platformService.isIos()) {
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

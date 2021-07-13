import { Injectable, NgZone } from '@angular/core';
import { LoginBroker } from '@app/common/login-broker';
import { StartBrokerInfo } from '@app/common/start-broker-info';
import { BrokerService } from '@app/services/broker.service';
import { LoginService } from '@app/services/login.service';
import { PlatformService } from '@app/services/platform.service';
import { IAppState } from '@app/store/app.state';
import { selectBrokerName } from '@app/store/broker/broker.selectors';
import { selectReady } from '@app/store/ready/ready.selectors';
import { App } from '@capacitor/app';
import { PluginListenerHandle } from '@capacitor/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DeepLinkService {

  private readonly _brokerService: BrokerService;
  private readonly _loginService: LoginService;
  private readonly _platformService: PlatformService;
  private readonly _store: Store<IAppState>;
  private readonly _zone: NgZone;

  private _ready: boolean = false;
  private _active: boolean = false;
  private _pendingStartInfo: StartBrokerInfo | null = null;
  private _readySub: Subscription | null = null;
  private _brokerNameSub: Subscription | null = null;
  private _appUrlListenerSub: PluginListenerHandle | null = null;

  public constructor(
    brokerService: BrokerService,
    loginService: LoginService,
    platformService: PlatformService,
    store: Store<IAppState>,
    zone: NgZone
  ) {
    this._brokerService = brokerService;
    this._loginService = loginService;
    this._platformService = platformService;
    this._store = store;
    this._zone = zone;
  }

  public attachHandlers(): void {
    if (this._platformService.isAndroid()) {
      if (this._readySub == null) {
        this._readySub = this._store.select(selectReady).subscribe(ready => {
          this._ready = ready;
          this.processStartInfo();
        });
      }

      if (this._brokerNameSub == null) {
        this._brokerNameSub = this._store.select(selectBrokerName).subscribe(name => {
          this._active = name != null && name.trim().length > 0;
        });
      }

      if (this._appUrlListenerSub == null) {
        this._appUrlListenerSub = App.addListener('appUrlOpen', openUrl => {
          if (openUrl.url.trim().length > 0) {
            try {
              const urlInst: URL = new URL(openUrl.url);

              let name: string | null = null;
              let url: string | null = null;
              let login: boolean = true;
              let save: boolean = false;

              if (urlInst.searchParams.has('name')) {
                const nameStr: string | null = urlInst.searchParams.get('name');
                if (nameStr != null) {
                  name = decodeURIComponent(nameStr);
                }
              }

              if (urlInst.searchParams.has('url')) {
                const urlStr: string | null = urlInst.searchParams.get('url');
                if (urlStr != null) {
                  url = decodeURIComponent(urlStr);
                }
              }

              if (urlInst.searchParams.has('login')) {
                const loginStr: string | null = urlInst.searchParams.get('login');
                if (loginStr != null) {
                  login = loginStr.toLowerCase() === 'true';
                }
              }

              if (urlInst.searchParams.has('save')) {
                const saveStr: string | null = urlInst.searchParams.get('save');
                if (saveStr != null) {
                  save = saveStr.toLowerCase() === 'true';
                }
              }

              if (name != null && name.trim().length > 0 && url != null && url.trim().length > 0) {
                this._pendingStartInfo = {
                  broker: new LoginBroker(name, url),
                  login,
                  save
                };
              }

              this.processStartInfo();
            } catch {
              // malformed url => do nothing
            }
          }
        });
      }
    }
  }

  public removeHandlers(): void {
    if (this._platformService.isAndroid()) {
      this._readySub?.unsubscribe();
      this._readySub = null;

      this._brokerNameSub?.unsubscribe();
      this._brokerNameSub = null;

      if (this._appUrlListenerSub != null) {
        this._appUrlListenerSub.remove().catch(err => {
          this._zone.run(() => {
            throw Error.ensureError(err);
          });
        });

        this._appUrlListenerSub = null;
      }
    }
  }

  private processStartInfo(): void {
    this._zone.run(() => {
      if (this._ready && !this._active && this._pendingStartInfo) {
        if (this._pendingStartInfo.save) {
          this._loginService.addOrUpdateBroker(this._pendingStartInfo.broker);
        }

        if (this._pendingStartInfo.login) {
          this._brokerService.login(this._pendingStartInfo.broker, false);
        }

        this._pendingStartInfo = null;
      }
    });
  }
}

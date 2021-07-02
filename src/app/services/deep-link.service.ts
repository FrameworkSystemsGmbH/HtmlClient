import { Injectable, NgZone } from '@angular/core';
import { LoginBroker } from '@app/common/login-broker';
import { StartBrokerInfo } from '@app/common/start-broker-info';
import { BrokerService } from '@app/services/broker.service';
import { LoginService } from '@app/services/login.service';
import { PlatformService } from '@app/services/platform.service';
import { IAppState } from '@app/store/app.state';
import { selectBrokerName } from '@app/store/broker/broker.selectors';
import { selectReady } from '@app/store/ready/ready.selectors';
import { Plugins } from '@capacitor/core';
import { Store } from '@ngrx/store';

const { App } = Plugins;

@Injectable({ providedIn: 'root' })
export class DeepLinkService {

  private _ready: boolean = false;
  private _active: boolean = false;
  private _pendingStartInfo: StartBrokerInfo | null = null;

  public constructor(
    private readonly _brokerService: BrokerService,
    private readonly _loginService: LoginService,
    private readonly _platformService: PlatformService,
    private readonly _store: Store<IAppState>,
    private readonly _zone: NgZone
  ) { }

  public attachHandlers(): void {
    if (this._platformService.isAndroid()) {
      this._store.select(selectReady).subscribe(ready => {
        this._ready = ready;
        this.processStartInfo();
      });

      this._store.select(selectBrokerName).subscribe(name => {
        this._active = !String.isNullOrWhiteSpace(name);
      });

      App.addListener('appUrlOpen', openUrl => {
        if (openUrl.url.trim().length) {
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

            if (name != null && name.trim().length && url != null && url.trim().length) {
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

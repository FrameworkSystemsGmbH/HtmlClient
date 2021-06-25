import { Injectable, NgZone } from '@angular/core';
import { StartBrokerInfo } from '@app/common/start-broker-info';
import { BrokerService } from '@app/services/broker.service';
import { LoginService } from '@app/services/login.service';
import { PlatformService } from '@app/services/platform.service';
import { selectBrokerName } from '@app/store/broker/broker.selectors';
import { selectReady } from '@app/store/ready/ready.selectors';
import { Plugins } from '@capacitor/core';
import { Store } from '@ngrx/store';

const { App } = Plugins;

@Injectable({ providedIn: 'root' })
export class DeepLinkService {

  private _ready: boolean;
  private _active: boolean;
  private _pendingStartInfo: StartBrokerInfo;

  public constructor(
    private readonly _brokerService: BrokerService,
    private readonly _loginService: LoginService,
    private readonly _platformService: PlatformService,
    private readonly _store: Store,
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
        if (openUrl != null && !String.isNullOrWhiteSpace(openUrl.url)) {
          try {
            const urlInst: URL = new URL(openUrl.url);

            let name: string;
            let url: string;
            let login: boolean = true;
            let save: boolean = false;

            if (urlInst.searchParams.has('name')) {
              name = decodeURIComponent(urlInst.searchParams.get('name'));
            }

            if (urlInst.searchParams.has('url')) {
              url = decodeURIComponent(urlInst.searchParams.get('url'));
            }

            if (urlInst.searchParams.has('login')) {
              login = urlInst.searchParams.get('login').toLowerCase() === 'true';
            }

            if (urlInst.searchParams.has('save')) {
              save = urlInst.searchParams.get('save').toLowerCase() === 'true';
            }

            if (!String.isNullOrWhiteSpace(name) && !String.isNullOrWhiteSpace(url)) {
              this._pendingStartInfo = {
                broker: {
                  name,
                  url
                },
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

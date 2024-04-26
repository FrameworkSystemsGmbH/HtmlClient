import { Injectable, NgZone } from '@angular/core';
import { BackButtonPriority } from '@app/enums/backbutton-priority';
import { PlatformService } from '@app/services/platform.service';
import { App } from '@capacitor/app';
import { PluginListenerHandle } from '@capacitor/core';

interface IListenerInfo {
  priority: BackButtonPriority;
  listener: () => boolean;
}
/** Nur für Android für den BackButton (zurück). Reagiert auf den BackButton
 * und schließt die Session.
*/
@Injectable({ providedIn: 'root' })
export class BackService {

  private readonly _zone: NgZone;
  private readonly _platformService: PlatformService;

  private readonly _listener: () => any;

  private _listenerSub: PluginListenerHandle | null = null;
  private _listeners: Array<IListenerInfo> = new Array<IListenerInfo>();


  public constructor(
    zone: NgZone,
    platformService: PlatformService
  ) {
    this._zone = zone;
    this._platformService = platformService;

    this._listener = this.onBackButton.bind(this);
  }

  public attachHandlers(): void {
    if (this._platformService.isAndroid() && this._listenerSub == null) {
      this._listenerSub = App.addListener('backButton', this._listener);
    }
  }

  public removeHandlers(): void {
    if (this._platformService.isAndroid() && this._listenerSub != null) {
      this._listenerSub.remove().catch(err => {
        this._zone.run(() => {
          throw Error.ensureError(err);
        });
      });

      this._listenerSub = null;
    }
  }

  public addBackButtonListener(listener: () => boolean, priority: BackButtonPriority): void {
    this._listeners.push({
      listener,
      priority
    });

    this._listeners = this._listeners.sort((a, b) => {
      const aPrio: BackButtonPriority = a.priority;
      const bPrio: BackButtonPriority = b.priority;
      if (aPrio > bPrio) {
        return 1;
      } else if (aPrio < bPrio) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  public removeBackButtonListener(listener: () => boolean): void {
    const info: IListenerInfo | undefined = this._listeners.find(i => i.listener === listener);

    if (info) {
      this._listeners.remove(info);
    }
  }

  private onBackButton(): void {
    this._zone.run(() => {
      for (const info of this._listeners) {
        const handled: boolean = info.listener();
        if (handled) {
          return;
        }
      }

      (navigator as any).app.exitApp();
    });
  }
}

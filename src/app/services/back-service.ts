import { Injectable, NgZone } from '@angular/core';
import { BackButtonPriority } from '@app/enums/backbutton-priority';
import { PlatformService } from '@app/services/platform.service';
import { PluginListenerHandle, Plugins } from '@capacitor/core';

const { App } = Plugins;

interface IListenerInfo {
  priority: BackButtonPriority;
  listener: () => boolean;
}

@Injectable({ providedIn: 'root' })
export class BackService {

  private readonly _listener: () => any;

  private _listenerSub: PluginListenerHandle;
  private _listeners: Array<IListenerInfo> = new Array<IListenerInfo>();


  public constructor(
    private readonly _zone: NgZone,
    private readonly _platformService: PlatformService
  ) {
    this._listener = this.onBackButton.bind(this);
  }

  public attachHandlers(): void {
    if (this._platformService.isAndroid()) {
      if (this._listenerSub != null) {
        this._listenerSub.remove();
      }

      this._listenerSub = App.addListener('backButton', this._listener);
    }
  }

  public removeHandlers(): void {
    if (this._platformService.isAndroid() && this._listenerSub != null) {
      this._listenerSub.remove();
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
    const info: IListenerInfo = this._listeners.find(i => i.listener === listener);

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

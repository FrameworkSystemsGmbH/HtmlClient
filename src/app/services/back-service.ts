import { Injectable, NgZone } from '@angular/core';
import { PlatformService } from 'app/services/platform/platform.service';
import { BackButtonPriority } from 'app/enums/backbutton-priority';

interface IListenerInfo {
  priority: BackButtonPriority;
  listener(): boolean;
}

@Injectable()
export class BackService {

  private _listener: (ev: Event) => any;
  private _listeners: Array<IListenerInfo> = new Array<IListenerInfo>();

  constructor(
    private _zone: NgZone,
    private _platformService: PlatformService
  ) {
    this._listener = this.onBackButton.bind(this);
  }

  public attachHandlers(): void {
    if (this._platformService.isAndroid()) {
      document.addEventListener('backbutton', this._listener, false);
    }
  }

  public removeHandlers(): void {
    if (this._platformService.isAndroid()) {
      document.removeEventListener('backbutton', this._listener, false);
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

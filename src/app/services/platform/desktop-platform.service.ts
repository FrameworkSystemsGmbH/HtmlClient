import { PlatformService } from 'app/services/platform/platform.service';
import { Injectable } from '@angular/core';
import { ClientPlatform } from 'app/enums/client-platform';
import { ipcRenderer } from 'electron';

@Injectable()
export class DesktopPlatformService extends PlatformService {

  private _ipc: typeof ipcRenderer;

  constructor() {
    super();
    this._ipc = (window as any).require('electron').ipcRenderer;
  }

  public getPlatform(): ClientPlatform {
    return ClientPlatform.Desktop;
  }

  public getOS(): string {
    const platform: string = this._ipc.sendSync('getPlatform') as string;

    switch (platform) {
      case 'aix':
        return 'AIX';
      case 'darwin':
        return 'Mac';
      case 'freebsd':
        return 'FreeBSD';
      case 'linux':
        return 'Linux';
      case 'openbsd':
        return 'OpenBSD';
      case 'sunos':
        return 'SunOS';
      case 'win32':
        return 'Windows';
      default:
        return 'Unknown';
    }
  }

  public getOSVersion(): string {
    return navigator.userAgent;
  }
}

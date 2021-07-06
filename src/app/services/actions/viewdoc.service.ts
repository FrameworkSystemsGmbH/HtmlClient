import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Browser } = Plugins;

@Injectable({ providedIn: 'root' })
export class ViewDocService {

  public viewDocument(url: string): void {
    if (url.trim().length > 0) {
      void Browser.open({ url });
    }
  }
}

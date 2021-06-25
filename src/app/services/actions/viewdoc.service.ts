import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Browser } = Plugins;

@Injectable()
export class ViewDocService {

  public viewDocument(url: string): void {
    if (!String.isNullOrWhiteSpace(url)) {
      void Browser.open({ url });
    }
  }
}

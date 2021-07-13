import { Injectable } from '@angular/core';
import { Browser } from '@capacitor/browser';

@Injectable({ providedIn: 'root' })
export class ViewDocService {

  public viewDocument(url: string): void {
    if (url.trim().length > 0) {
      void Browser.open({ url });
    }
  }
}

import { Injectable } from '@angular/core';
import { IAppState } from '@app/store/app.state';
import { selectBrokerFilesUrl } from '@app/store/broker/broker.selectors';
import { Browser } from '@capacitor/browser';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class ViewDocService {

  private readonly brokerScheme: string = 'fsbroker://';

  private _brokerUrl: string | null = null;

  public constructor(store: Store<IAppState>) {
    store.select(selectBrokerFilesUrl).subscribe({
      next: filesUrl => {
        this._brokerUrl = filesUrl;
      }
    });
  }

  public viewDocument(url: string): void {
    if (url.trim().length > 0) {
      let newUrl: string = url;

      if (this._brokerUrl != null && newUrl.startsWith(this.brokerScheme)) {
        newUrl = `${this._brokerUrl}/${newUrl.trimStringLeft(this.brokerScheme)}`;
      }

      void Browser.open({ url: newUrl });
    }
  }
}

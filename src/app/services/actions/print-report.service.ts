import { Injectable } from '@angular/core';
import { IAppState } from '@app/store/app.state';
import { selectBrokerReportUrl } from '@app/store/broker/broker.selectors';
import { Browser } from '@capacitor/browser';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class PrintReportService {

  private readonly _store: Store<IAppState>;

  private _reportUrl: string | null | undefined = null;

  public constructor(store: Store<IAppState>) {
    this._store = store;

    this._store.select(selectBrokerReportUrl).subscribe({
      next: reportUrl => {
        this._reportUrl = reportUrl;
      }
    });
  }

  public printReport(id: string): void {
    if (this._reportUrl != null && this._reportUrl.trim().length > 0 && id.trim().length > 0) {
      void Browser.open({ url: `${this._reportUrl}?id=${id}` });
    }
  }
}

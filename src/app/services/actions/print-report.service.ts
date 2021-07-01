import { Injectable } from '@angular/core';
import { IAppState } from '@app/store/app.state';
import { selectBrokerReportUrl } from '@app/store/broker/broker.selectors';
import { Plugins } from '@capacitor/core';
import { Store } from '@ngrx/store';

const { Browser } = Plugins;

@Injectable({ providedIn: 'root' })
export class PrintReportService {

  private readonly _store: Store<IAppState>;

  private _reportUrl: string | null | undefined = null;

  public constructor(store: Store<IAppState>) {
    this._store = store;

    this._store.select(selectBrokerReportUrl).subscribe(reportUrl => {
      this._reportUrl = reportUrl;
    });
  }

  public printReport(id: string): void {
    if (this._reportUrl != null && this._reportUrl.trim().length && id != null && id.trim().length) {
      void Browser.open({ url: `${this._reportUrl}?id=${id}` });
    }
  }
}

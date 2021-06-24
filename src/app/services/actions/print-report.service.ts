import { Injectable } from '@angular/core';
import { selectBrokerReportUrl } from '@app/store/broker/broker.selectors';
import { Plugins } from '@capacitor/core';
import { Store } from '@ngrx/store';

const { Browser } = Plugins;

@Injectable()
export class PrintReportService {

  private _reportUrl: string;

  constructor(private store: Store) {
    this.store.select(selectBrokerReportUrl).subscribe(reportUrl => {
      this._reportUrl = reportUrl;
    });
  }

  public printReport(id: string): void {
    if (!String.isNullOrWhiteSpace(id)) {
      Browser.open({ url: `${this._reportUrl}?id=${id}` });
    }
  }
}

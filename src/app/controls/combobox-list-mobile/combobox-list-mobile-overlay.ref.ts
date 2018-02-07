import { Observable } from 'rxjs/Observable';

import { IComboBoxListMobileOverlayClosedData } from 'app/controls/combobox-list-mobile/combobox-list-mobile-overlay';

export class ComboBoxListMobileOverlayRef {

  private onClosed$: Observable<IComboBoxListMobileOverlayClosedData>;

  constructor(onClosed$: Observable<IComboBoxListMobileOverlayClosedData>) {
    this.onClosed$ = onClosed$;
  }

  public onClosed(): Observable<IComboBoxListMobileOverlayClosedData> {
    return this.onClosed$;
  }
}

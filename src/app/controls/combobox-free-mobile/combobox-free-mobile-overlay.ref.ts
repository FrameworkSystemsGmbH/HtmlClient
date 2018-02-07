import { Observable } from 'rxjs/Observable';

import { IComboBoxFreeMobileOverlayClosedData } from 'app/controls/combobox-free-mobile/combobox-free-mobile-overlay';

export class ComboBoxFreeMobileOverlayRef {

  private onClosed$: Observable<IComboBoxFreeMobileOverlayClosedData>;

  constructor(onClosed$: Observable<IComboBoxFreeMobileOverlayClosedData>) {
    this.onClosed$ = onClosed$;
  }

  public onClosed(): Observable<IComboBoxFreeMobileOverlayClosedData> {
    return this.onClosed$;
  }
}

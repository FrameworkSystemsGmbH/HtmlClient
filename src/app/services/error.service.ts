import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ErrorBoxComponent } from 'app/components/errorbox/errorbox.component';

@Injectable()
export class ErrorService extends ErrorHandler {

  private zone: NgZone;
  private errorDialog: MatDialog;

  constructor(private injector: Injector) {
    super();
  }

  public handleError(error: any): void {
    if (!this.zone) {
      this.zone = this.injector.get(NgZone);
    }

    if (!this.errorDialog) {
      this.errorDialog = this.injector.get(MatDialog);
    }

    this.zone.run(() => {
      this.errorDialog.open(ErrorBoxComponent, {
        backdropClass: 'hc-backdrop',
        minWidth: 300,
        maxWidth: '90%',
        maxHeight: '90%',
        data: {
          message: error && error.message ? error.message : 'An unknown error occured!',
          stackTrace: error && error.stack ? error.stack : null
        }
      });
    });

    super.handleError(error);
  }
}

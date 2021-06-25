import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorBoxComponent } from '@app/components/errorbox/errorbox.component';

@Injectable({ providedIn: 'root' })
export class ErrorService extends ErrorHandler {

  private _zone: NgZone;
  private _errorDialog: MatDialog;

  public constructor(private readonly _injector: Injector) {
    super();
  }

  public handleError(error: any): void {
    if (!this._zone) {
      this._zone = this._injector.get(NgZone);
    }

    if (!this._errorDialog) {
      this._errorDialog = this._injector.get(MatDialog);
    }

    this._zone.run(() => {
      this._errorDialog.open(ErrorBoxComponent, {
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

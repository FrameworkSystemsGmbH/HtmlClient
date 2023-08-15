import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { DialogService } from '@app/services/dialog.service';

@Injectable({ providedIn: 'root' })
export class ErrorService extends ErrorHandler {

  private readonly _zone: NgZone;
  private readonly _dialogService: DialogService;

  public constructor(
    zone: NgZone,
    dialogService: DialogService
  ) {
    super();

    this._zone = zone;
    this._dialogService = dialogService;
  }

  public override handleError(error: unknown): void {
    this._zone.run(() => {
      this._dialogService.showErrorBoxForError(Error.ensureError(error));
    });

    super.handleError(error);
  }
}

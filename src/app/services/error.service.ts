import { ErrorHandler, inject, Injectable, NgZone } from '@angular/core';
import { DialogService } from '@app/services/dialog.service';

@Injectable({ providedIn: 'root' })
export class ErrorService extends ErrorHandler {

  private readonly _zone = inject(NgZone);
  private readonly _dialogService = inject(DialogService);

  public override handleError(error: unknown): void {
    this._zone.run(() => {
      this._dialogService.showErrorBoxForError(Error.ensureError(error));
    });

    super.handleError(error);
  }
}

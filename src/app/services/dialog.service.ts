import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IErrorBoxData } from '@app/components/errorbox/errorbox-data.interface';
import { ErrorBoxComponent } from '@app/components/errorbox/errorbox.component';
import { IMsgBoxData } from '@app/components/msgbox/msgbox-data.interface';
import { MsgBoxComponent } from '@app/components/msgbox/msgbox.component';
import { IRetryBoxData } from '@app/components/retrybox/retrybox-data.interface';
import { RetryBoxComponent } from '@app/components/retrybox/retrybox.component';
import { MsgBoxResult } from '@app/enums/msgbox-result';
import { RetryBoxResult } from '@app/enums/retrybox-result';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DialogService {

  private readonly _dialog: MatDialog;

  public constructor(dialog: MatDialog) {
    this._dialog = dialog;
  }

  public showErrorBoxForError(error: Error): Observable<void> {
    return this.showErrorBox({
      title: error.name,
      message: error.message,
      stackTrace: error.stack
    });
  }

  public showErrorBox(data: IErrorBoxData): Observable<void> {
    const dialogRef: MatDialogRef<ErrorBoxComponent, void> = this._dialog.open(ErrorBoxComponent, {
      backdropClass: 'hc-backdrop',
      minWidth: 300,
      maxWidth: '90%',
      maxHeight: '90%',
      disableClose: true,
      data
    });

    return dialogRef.afterClosed();
  }

  public showMsgBox(data: IMsgBoxData): Observable<MsgBoxResult> {
    const msgBoxRef: MatDialogRef<MsgBoxComponent, MsgBoxResult> = this._dialog.open(MsgBoxComponent, {
      backdropClass: 'hc-backdrop',
      minWidth: 300,
      maxWidth: '90%',
      maxHeight: '90%',
      disableClose: true,
      data
    });

    return msgBoxRef.afterClosed().pipe(
      map(msgBoxResult => msgBoxResult as MsgBoxResult)
    );
  }

  public showRetryBox(data: IRetryBoxData): Observable<RetryBoxResult> {
    const retryBoxRef: MatDialogRef<RetryBoxComponent, RetryBoxResult> = this._dialog.open(RetryBoxComponent, {
      backdropClass: 'hc-backdrop',
      minWidth: 300,
      maxWidth: '90%',
      maxHeight: '90%',
      disableClose: true,
      data
    });

    return retryBoxRef.afterClosed().pipe(
      map(retryBoxResult => retryBoxResult as RetryBoxResult)
    );
  }
}

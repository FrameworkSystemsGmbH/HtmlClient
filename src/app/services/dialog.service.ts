import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IErrorBoxData } from 'app/components/errorbox/errorbox-data.interface';
import { IMsgBoxData } from 'app/components/msgbox/msgbox-data.interface';

import { ErrorBoxComponent } from 'app/components/errorbox/errorbox.component';
import { MsgBoxResult } from 'app/enums/msgbox-result';
import { MsgBoxComponent } from '../components/msgbox/msgbox.component';

@Injectable()
export class DialogService {

  constructor(private dialog: MatDialog) { }

  public showErrorBox(data: IErrorBoxData): Observable<void> {
    const dialogRef: MatDialogRef<ErrorBoxComponent, any> = this.dialog.open(ErrorBoxComponent, {
      backdropClass: 'hc-backdrop',
      minWidth: 300,
      maxWidth: '90%',
      maxHeight: '90%',
      disableClose: true,
      data
    });

    return dialogRef.afterClosed();
  }

  public showMsgBoxBox(data: IMsgBoxData): Observable<MsgBoxResult> {
    const msgBoxRef: MatDialogRef<MsgBoxComponent, any> = this.dialog.open(MsgBoxComponent, {
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
}

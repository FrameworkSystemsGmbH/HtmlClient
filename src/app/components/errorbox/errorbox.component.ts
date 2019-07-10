import { Component, Inject, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';

import { IErrorBoxData } from 'app/components/errorbox/errorbox-data.interface';

@Component({
  selector: 'hc-errorbox',
  templateUrl: './errorbox.component.html',
  styleUrls: ['./errorbox.component.scss']
})
export class ErrorBoxComponent implements OnInit, OnDestroy {

  @ViewChild('footer', { static: true })
  public footer: ElementRef;

  public title: string;
  public message: string;
  public stackTrace: string;
  public showStackTrace: boolean;

  private afterOpenSub: Subscription;

  constructor(
    private dialogRef: MatDialogRef<ErrorBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IErrorBoxData
  ) {
    this.title = data.title;
    this.message = data.message;
    this.stackTrace = data.stackTrace;
  }

  public ngOnInit(): void {
    this.afterOpenSub = this.dialogRef.afterOpened().subscribe(() => {
      setTimeout(() => this.footer.nativeElement.focus());
    });
  }

  public ngOnDestroy(): void {
    if (this.afterOpenSub) {
      this.afterOpenSub.unsubscribe();
    }
  }

  public onDetailsClick(event: any): void {
    this.showStackTrace = !this.showStackTrace;
  }

  public onOkClick(event: any): void {
    this.dialogRef.close();
  }
}

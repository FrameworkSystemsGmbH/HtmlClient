import { Component, Inject, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';

import { IRetryBoxData } from 'app/components/retrybox/retrybox-data.interface';

import { RetryBoxResult } from 'app/enums/retrybox-result';

@Component({
  selector: 'hc-retrybox',
  templateUrl: './retrybox.component.html',
  styleUrls: ['./retrybox.component.scss']
})
export class RetryBoxComponent implements OnInit, OnDestroy {

  @ViewChild('footer', { static: true })
  public footer: ElementRef;

  public title: string;
  public message: string;
  public stackTrace: string;
  public showStackTrace: boolean;

  private afterOpenSub: Subscription;

  constructor(
    private dialogRef: MatDialogRef<RetryBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IRetryBoxData
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

  public onAbortClick(event: any): void {
    this.dialogRef.close(RetryBoxResult.Abort);
  }

  public onRetryClick(event: any): void {
    this.dialogRef.close(RetryBoxResult.Retry);
  }
}

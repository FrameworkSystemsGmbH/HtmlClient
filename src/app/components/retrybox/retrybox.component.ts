import { Component, Inject, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';

import { IRetryBoxData } from 'app/components/retrybox/retrybox-data.interface';

import { RetryBoxResult } from 'app/enums/retrybox-result';
import { HardwareService } from 'app/services/hardware-service';
import { BackButtonPriority } from 'app/enums/backbutton-priority';

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
  private onBackButtonListener: () => boolean;

  constructor(
    private hardwareService: HardwareService,
    private dialogRef: MatDialogRef<RetryBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IRetryBoxData
  ) {
    this.title = data.title;
    this.message = data.message;
    this.stackTrace = data.stackTrace;
  }

  public ngOnInit(): void {
    this.onBackButtonListener = this.onBackButton.bind(this);
    this.hardwareService.addBackButtonListener(this.onBackButtonListener, BackButtonPriority.Overlay);

    this.afterOpenSub = this.dialogRef.afterOpened().subscribe(() => {
      setTimeout(() => this.footer.nativeElement.focus());
    });
  }

  public ngOnDestroy(): void {
    this.hardwareService.removeBackButtonListener(this.onBackButtonListener);

    if (this.afterOpenSub) {
      this.afterOpenSub.unsubscribe();
    }
  }

  private onBackButton(): boolean {
    this.dialogRef.close(RetryBoxResult.Abort);
    return true;
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

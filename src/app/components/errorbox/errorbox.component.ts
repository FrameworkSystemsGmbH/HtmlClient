import { Component, Inject, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';

import { IErrorBoxData } from 'app/components/errorbox/errorbox-data.interface';
import { BackService } from 'app/services/back-service';
import { BackButtonPriority } from 'app/enums/backbutton-priority';

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
  private onBackButtonListener: () => boolean;

  constructor(
    private backService: BackService,
    private dialogRef: MatDialogRef<ErrorBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IErrorBoxData
  ) {
    this.title = data.title;
    this.message = data.message;
    this.stackTrace = data.stackTrace;
  }

  public ngOnInit(): void {
    this.onBackButtonListener = this.onBackButton.bind(this);
    this.backService.addBackButtonListener(this.onBackButtonListener, BackButtonPriority.Overlay);

    this.afterOpenSub = this.dialogRef.afterOpened().subscribe(() => {
      setTimeout(() => this.footer.nativeElement.focus());
    });
  }

  public ngOnDestroy(): void {
    this.backService.removeBackButtonListener(this.onBackButtonListener);

    if (this.afterOpenSub) {
      this.afterOpenSub.unsubscribe();
    }
  }

  private onBackButton(): boolean {
    this.dialogRef.close();
    return true;
  }

  public onDetailsClick(event: any): void {
    this.showStackTrace = !this.showStackTrace;
  }

  public onOkClick(event: any): void {
    this.dialogRef.close();
  }
}

import { Component, Inject, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';

import { IMsgBoxData } from 'app/components/msgbox/msgbox-data.interface';

import { MsgBoxButtons } from 'app/enums/msgbox-buttons';
import { MsgBoxIcon } from 'app/enums/msgbox-icon';
import { MsgBoxResult } from 'app/enums/msgbox-result';
import { HardwareService } from 'app/services/hardware-service';
import { BackButtonPriority } from 'app/enums/backbutton-priority';

@Component({
  selector: 'hc-msgbox',
  templateUrl: './msgbox.component.html',
  styleUrls: ['./msgbox.component.scss']
})
export class MsgBoxComponent implements OnInit, OnDestroy {

  @ViewChild('footer', { static: true })
  public footer: ElementRef;

  public title: string;
  public message: string;
  public icon: MsgBoxIcon;
  public iconType: typeof MsgBoxIcon = MsgBoxIcon;
  public buttons: MsgBoxButtons;
  public buttonsType: typeof MsgBoxButtons = MsgBoxButtons;

  private afterOpenSub: Subscription;
  private onBackButtonListener: () => boolean;

  constructor(
    private hardwareService: HardwareService,
    private dialogRef: MatDialogRef<MsgBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IMsgBoxData
  ) {
    this.title = data.title;
    this.message = data.message;
    this.icon = data.icon;
    this.buttons = data.buttons;
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
    switch (this.buttons) {
      case MsgBoxButtons.AbortRetryIgnore:
        this.dialogRef.close(MsgBoxResult.Abort);
        break;
      case MsgBoxButtons.Ok:
        this.dialogRef.close(MsgBoxResult.Ok);
        break;
      case MsgBoxButtons.OkCancel:
        this.dialogRef.close(MsgBoxResult.Cancel);
        break;
      case MsgBoxButtons.RetryCancel:
        this.dialogRef.close(MsgBoxResult.Cancel);
        break;
      case MsgBoxButtons.YesNoCancel:
        this.dialogRef.close(MsgBoxResult.Cancel);
        break;
    }

    return true;
  }

  public onYesClick(event: any): void {
    this.dialogRef.close(MsgBoxResult.Yes);
  }

  public onNoClick(event: any): void {
    this.dialogRef.close(MsgBoxResult.No);
  }

  public onOkClick(event: any): void {
    this.dialogRef.close(MsgBoxResult.Ok);
  }

  public onAbortClick(event: any): void {
    this.dialogRef.close(MsgBoxResult.Abort);
  }

  public onRetryClick(event: any): void {
    this.dialogRef.close(MsgBoxResult.Retry);
  }

  public onIgnoreClick(event: any): void {
    this.dialogRef.close(MsgBoxResult.Ignore);
  }

  public onCancelClick(event: any): void {
    this.dialogRef.close(MsgBoxResult.Cancel);
  }
}

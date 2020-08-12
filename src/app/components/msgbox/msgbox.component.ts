import { Component, Inject, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { IMsgBoxData } from 'app/components/msgbox/msgbox-data.interface';

import { MsgBoxButtons } from 'app/enums/msgbox-buttons';
import { MsgBoxIcon } from 'app/enums/msgbox-icon';
import { MsgBoxResult } from 'app/enums/msgbox-result';
import { BackService } from 'app/services/back-service';
import { BackButtonPriority } from 'app/enums/backbutton-priority';

@Component({
  selector: 'hc-msgbox',
  templateUrl: './msgbox.component.html',
  styleUrls: ['./msgbox.component.scss']
})
export class MsgBoxComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('footer', { static: true })
  public footer: ElementRef;

  public title: string;
  public message: string;
  public icon: MsgBoxIcon;
  public iconType: typeof MsgBoxIcon = MsgBoxIcon;
  public buttons: MsgBoxButtons;
  public buttonsType: typeof MsgBoxButtons = MsgBoxButtons;

  private onBackButtonListener: () => boolean;

  constructor(
    private backService: BackService,
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
    this.backService.addBackButtonListener(this.onBackButtonListener, BackButtonPriority.Overlay);
  }

  public ngAfterViewInit(): void {
    this.footer.nativeElement.focus();
  }

  public ngOnDestroy(): void {
    this.backService.removeBackButtonListener(this.onBackButtonListener);
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

  public onYesClick(): void {
    this.dialogRef.close(MsgBoxResult.Yes);
  }

  public onNoClick(): void {
    this.dialogRef.close(MsgBoxResult.No);
  }

  public onOkClick(): void {
    this.dialogRef.close(MsgBoxResult.Ok);
  }

  public onAbortClick(): void {
    this.dialogRef.close(MsgBoxResult.Abort);
  }

  public onRetryClick(): void {
    this.dialogRef.close(MsgBoxResult.Retry);
  }

  public onIgnoreClick(): void {
    this.dialogRef.close(MsgBoxResult.Ignore);
  }

  public onCancelClick(): void {
    this.dialogRef.close(MsgBoxResult.Cancel);
  }
}

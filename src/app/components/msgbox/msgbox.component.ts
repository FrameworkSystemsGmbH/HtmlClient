import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IMsgBoxData } from '@app/components/msgbox/msgbox-data.interface';
import { BackButtonPriority } from '@app/enums/backbutton-priority';
import { MsgBoxButtons } from '@app/enums/msgbox-buttons';
import { MsgBoxIcon } from '@app/enums/msgbox-icon';
import { MsgBoxResult } from '@app/enums/msgbox-result';
import { BackService } from '@app/services/back-service';
import { faExclamationCircle, faExclamationTriangle, faInfoCircle, faQuestionCircle, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'hc-msgbox',
  templateUrl: './msgbox.component.html',
  styleUrls: ['./msgbox.component.scss']
})
export class MsgBoxComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('footer', { static: true })
  public footer: ElementRef<HTMLDivElement> | null = null;

  public iconExclamationCircle: IconDefinition = faExclamationCircle;
  public iconExclamationTriangle: IconDefinition = faExclamationTriangle;
  public iconInfoCircle: IconDefinition = faInfoCircle;
  public iconQuestionCircle: IconDefinition = faQuestionCircle;

  public title: string;
  public message: string;
  public icon: MsgBoxIcon;
  public iconType: typeof MsgBoxIcon = MsgBoxIcon;
  public buttons: MsgBoxButtons;
  public buttonsType: typeof MsgBoxButtons = MsgBoxButtons;

  private readonly _backService: BackService;
  private readonly _dialogRef: MatDialogRef<MsgBoxComponent>;

  private _onBackButtonListener: (() => boolean) | null = null;

  public constructor(
    backService: BackService,
    dialogRef: MatDialogRef<MsgBoxComponent>,
    @Inject(MAT_DIALOG_DATA) data: IMsgBoxData
  ) {
    this._backService = backService;
    this._dialogRef = dialogRef;

    this.title = data.title;
    this.message = data.message;
    this.icon = data.icon;
    this.buttons = data.buttons;
  }

  public ngOnInit(): void {
    this._onBackButtonListener = this.onBackButton.bind(this);
    this._backService.addBackButtonListener(this._onBackButtonListener, BackButtonPriority.Overlay);
  }

  public ngAfterViewInit(): void {
    if (this.footer != null) {
      this.footer.nativeElement.focus();
    }
  }

  public ngOnDestroy(): void {
    if (this._onBackButtonListener != null) {
      this._backService.removeBackButtonListener(this._onBackButtonListener);
    }
  }

  private onBackButton(): boolean {
    if (this.buttons === MsgBoxButtons.AbortRetryIgnore) {
      this._dialogRef.close(MsgBoxResult.Abort);
    } else if (this.buttons === MsgBoxButtons.Ok) {
      this._dialogRef.close(MsgBoxResult.Ok);
    } else if (this.buttons === MsgBoxButtons.OkCancel) {
      this._dialogRef.close(MsgBoxResult.Cancel);
    } else if (this.buttons === MsgBoxButtons.RetryCancel) {
      this._dialogRef.close(MsgBoxResult.Cancel);
    } else if (this.buttons === MsgBoxButtons.YesNoCancel) {
      this._dialogRef.close(MsgBoxResult.Cancel);
    }

    return true;
  }

  public onYesClick(): void {
    this._dialogRef.close(MsgBoxResult.Yes);
  }

  public onNoClick(): void {
    this._dialogRef.close(MsgBoxResult.No);
  }

  public onOkClick(): void {
    this._dialogRef.close(MsgBoxResult.Ok);
  }

  public onAbortClick(): void {
    this._dialogRef.close(MsgBoxResult.Abort);
  }

  public onRetryClick(): void {
    this._dialogRef.close(MsgBoxResult.Retry);
  }

  public onIgnoreClick(): void {
    this._dialogRef.close(MsgBoxResult.Ignore);
  }

  public onCancelClick(): void {
    this._dialogRef.close(MsgBoxResult.Cancel);
  }
}

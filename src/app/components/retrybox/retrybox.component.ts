import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IRetryBoxData } from '@app/components/retrybox/retrybox-data.interface';
import { DialogResizeDirective } from '@app/directives/dialog-resize.directive';
import { BackButtonPriority } from '@app/enums/backbutton-priority';
import { RetryBoxResult } from '@app/enums/retrybox-result';
import { BackService } from '@app/services/back-service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'hc-retrybox',
    templateUrl: './retrybox.component.html',
    styleUrls: ['./retrybox.component.scss'],
    imports: [
        A11yModule,
        CommonModule,
        DialogResizeDirective,
        FontAwesomeModule,
        MatButtonModule
    ]
})
export class RetryBoxComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('footer', { static: true })
  public footer: ElementRef<HTMLDivElement> | null = null;

  public iconExclamation: IconDefinition = faExclamationCircle;

  public title: string;
  public message: string;
  public stackTrace?: string;
  public showStackTrace: boolean = false;

  private readonly _backService: BackService;
  private readonly _dialogRef: MatDialogRef<RetryBoxComponent>;

  private _onBackButtonListener: (() => boolean) | null = null;

  public constructor(
    backService: BackService,
    dialogRef: MatDialogRef<RetryBoxComponent>,
    @Inject(MAT_DIALOG_DATA) data: IRetryBoxData
  ) {
    this._backService = backService;
    this._dialogRef = dialogRef;

    this.title = data.title;
    this.message = data.message;
    this.stackTrace = data.stackTrace;
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
    this._dialogRef.close(RetryBoxResult.Abort);
    return true;
  }

  public onDetailsClick(): void {
    this.showStackTrace = !this.showStackTrace;
  }

  public onAbortClick(): void {
    this._dialogRef.close(RetryBoxResult.Abort);
  }

  public onRetryClick(): void {
    this._dialogRef.close(RetryBoxResult.Retry);
  }
}

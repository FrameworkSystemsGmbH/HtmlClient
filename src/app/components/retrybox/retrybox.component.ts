import { A11yModule } from '@angular/cdk/a11y';
import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IRetryBoxData } from '@app/components/retrybox/retrybox-data.interface';
import { DialogResizeDirective } from '@app/directives/dialog-resize.directive';
import { BackButtonPriority } from '@app/enums/backbutton-priority';
import { RetryBoxResult } from '@app/enums/retrybox-result';
import { BackService } from '@app/services/back-service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faExclamationCircle, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'hc-retrybox',
  templateUrl: './retrybox.component.html',
  styleUrls: ['./retrybox.component.scss'],
  imports: [
    A11yModule,
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

  private readonly _backService = inject(BackService);
  private readonly _dialogRef = inject(MatDialogRef<RetryBoxComponent>);

  private _onBackButtonListener: (() => boolean) | null = null;

  public constructor() {
    const data = inject(MAT_DIALOG_DATA) as IRetryBoxData;

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

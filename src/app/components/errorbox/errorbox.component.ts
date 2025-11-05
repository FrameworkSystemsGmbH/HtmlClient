import { A11yModule } from '@angular/cdk/a11y';
import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IErrorBoxData } from '@app/components/errorbox/errorbox-data.interface';
import { DialogResizeDirective } from '@app/directives/dialog-resize.directive';
import { BackButtonPriority } from '@app/enums/backbutton-priority';
import { BackService } from '@app/services/back-service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faExclamationCircle, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'hc-errorbox',
  templateUrl: './errorbox.component.html',
  styleUrls: ['./errorbox.component.scss'],
  imports: [
    A11yModule,
    DialogResizeDirective,
    FontAwesomeModule,
    MatButtonModule
  ]
})
export class ErrorBoxComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('footer', { static: true })
  public footer: ElementRef<HTMLDivElement> | null = null;

  public iconExclamation: IconDefinition = faExclamationCircle;

  public title: string;
  public message: string;
  public stackTrace?: string;
  public showStackTrace: boolean = false;

  private readonly _backService = inject(BackService);
  private readonly _dialogRef = inject(MatDialogRef<ErrorBoxComponent>);

  private _onBackButtonListener: (() => boolean) | null = null;

  public constructor() {
    const data = inject(MAT_DIALOG_DATA) as IErrorBoxData;
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
    if (this._onBackButtonListener) {
      this._backService.removeBackButtonListener(this._onBackButtonListener);
    }
  }

  private onBackButton(): boolean {
    this._dialogRef.close();
    return true;
  }

  public onDetailsClick(): void {
    this.showStackTrace = !this.showStackTrace;
  }

  public onOkClick(): void {
    this._dialogRef.close();
  }
}

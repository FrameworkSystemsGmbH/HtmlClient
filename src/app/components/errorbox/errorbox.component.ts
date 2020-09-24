import { Component, Inject, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { IconDefinition, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { IErrorBoxData } from 'app/components/errorbox/errorbox-data.interface';
import { BackService } from 'app/services/back-service';
import { BackButtonPriority } from 'app/enums/backbutton-priority';

@Component({
  selector: 'hc-errorbox',
  templateUrl: './errorbox.component.html',
  styleUrls: ['./errorbox.component.scss']
})
export class ErrorBoxComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('footer', { static: true })
  public footer: ElementRef;

  public iconExclamation: IconDefinition = faExclamationCircle;

  public title: string;
  public message: string;
  public stackTrace: string;
  public showStackTrace: boolean;

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
  }

  public ngAfterViewInit(): void {
    this.footer.nativeElement.focus();
  }

  public ngOnDestroy(): void {
    this.backService.removeBackButtonListener(this.onBackButtonListener);
  }

  private onBackButton(): boolean {
    this.dialogRef.close();
    return true;
  }

  public onDetailsClick(): void {
    this.showStackTrace = !this.showStackTrace;
  }

  public onOkClick(): void {
    this.dialogRef.close();
  }
}

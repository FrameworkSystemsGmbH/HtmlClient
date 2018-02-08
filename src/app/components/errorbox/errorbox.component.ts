import { Component, Inject, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ISubscription } from 'rxjs/Subscription';

import { TitleService } from 'app/services/title.service';
import { DomUtil } from 'app/util/dom-util';

@Component({
  selector: 'hc-errorbox',
  templateUrl: './errorbox.component.html',
  styleUrls: ['./errorbox.component.scss']
})
export class ErrorBoxComponent implements OnInit, OnDestroy {

  @ViewChild('footer')
  public footer: ElementRef;

  public title: string;
  public message: string;
  public stackTrace: string;
  public showStackTrace: boolean;
  public wrapperStyle: any;

  private afterOpenSub: ISubscription;

  constructor(
    private titleService: TitleService,
    private dialogRef: MatDialogRef<ErrorBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.title = this.titleService.getTitle();
    this.message = data.message;
    this.stackTrace = data.stackTrace;
  }

  public ngOnInit(): void {
    this.refreshWrapperStyle();

    this.afterOpenSub = this.dialogRef.afterOpen().subscribe(() => {
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

  public onOkClick(event: any): void {
    this.dialogRef.close();
  }

  @HostListener('window:resize')
  public refreshWrapperStyle(): void {
    const maxWidth: number = DomUtil.getViewportWidth() * 0.9;
    const maxHeight: number = DomUtil.getViewportHeight() * 0.9;

    this.wrapperStyle = {
      'min-width.px': maxWidth < 300 ? maxWidth : 300,
      'max-width.px': Math.min(900, maxWidth),
      'max-height.px': maxHeight
    };
  }
}

import { Component, Inject, HostListener, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';

import { IErrorMessage } from 'app/components/errorbox/errorbox-overlay';

import { TitleService } from 'app/services/title.service';
import { ERRORBOX_DATA } from 'app/components/errorbox/errorbox.tokens';
import { DomUtil } from 'app/util/dom-util';

@Component({
  selector: 'hc-errorbox',
  templateUrl: './errorbox.component.html',
  styleUrls: ['./errorbox.component.scss']
})
export class ErrorBoxComponent implements OnInit, AfterViewInit {

  @ViewChild('footer')
  public footer: ElementRef;

  public title: string;
  public message: string;
  public stackTrace: string;
  public showStackTrace: boolean;
  public sizeStyle: any;

  constructor(
    private titleService: TitleService,
    private overlayRef: OverlayRef,
    @Inject(ERRORBOX_DATA) error: IErrorMessage
  ) {
    this.title = this.titleService.getTitle();
    this.message = error.message;
    this.stackTrace = error.stackTrace;
  }

  public ngOnInit(): void {
    this.refreshSizeStyle();
  }

  public ngAfterViewInit(): void {
    setTimeout(() => this.footer.nativeElement.focus());
  }

  public onDetailsClick(event: any): void {
    this.showStackTrace = !this.showStackTrace;
  }

  public onOkClick(event: any): void {
    this.overlayRef.dispose();
  }

  @HostListener('window:resize')
  public refreshSizeStyle(): void {
    const vpWidth: number = DomUtil.getViewportWidth();
    const vpHeight: number = DomUtil.getViewportHeight();

    this.sizeStyle = {
      'min-width.px': Math.min(300, vpWidth * 0.9),
      'max-width.px': Math.min(900, vpWidth * 0.9),
      'max-height.px': vpHeight * 0.9
    };
  }
}

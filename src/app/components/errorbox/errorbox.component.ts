import { Component, Inject, HostListener, OnInit, trigger, style, transition, animate, keyframes, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { IErrorMessage } from 'app/services/overlays/errorbox.service';

import { TitleService } from 'app/services/title.service';
import { ERRORBOX_DATA } from 'app/components/errorbox/errorbox.tokens';
import { ErrorBoxRef } from 'app/components/errorbox/errorbox.ref';
import { DomUtil } from 'app/util/dom-util';

@Component({
  selector: 'hc-errorbox',
  templateUrl: './errorbox.component.html',
  styleUrls: ['./errorbox.component.scss'],
  animations: [
    trigger('stackTraceState', [
      transition('void => *',
        animate('750ms ease-in-out', keyframes([
          style({ width: 0, height: 0, padding: 0, margin: 0, offset: 0 }),
          style({ width: 0, height: '*', padding: 0, margin: 0, offset: 0.4 }),
          style({ width: '*', height: '*', padding: '*', margin: '*', offset: 1 })
        ]))),
      transition('* => void',
        animate('750ms ease-in-out', keyframes([
          style({ width: '*', height: '*', padding: '*', margin: '*', offset: 0 }),
          style({ width: 0, height: '*', padding: 0, margin: 0, offset: 0.6 }),
          style({ width: 0, height: 0, padding: 0, margin: 0, offset: 1 })
        ])))
    ])
  ]
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
    private errorBoxRef: ErrorBoxRef,
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
    setTimeout(() => this.footer.nativeElement.focus(), 0);
  }

  public onDetailsClick(event: any): void {
    this.showStackTrace = !this.showStackTrace;
  }

  public onOkClick(event: any): void {
    this.errorBoxRef.close();
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

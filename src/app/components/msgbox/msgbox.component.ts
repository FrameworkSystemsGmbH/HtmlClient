import { Component, Inject, HostListener, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

import { IMsgBoxMessage } from 'app/services/overlays/msgbox.service';

import { TitleService } from 'app/services/title.service';
import { EventsService } from 'app/services/events.service';
import { MSGBOX_DATA } from 'app/components/msgbox/msgbox.tokens';
import { MsgBoxRef } from 'app/components/msgbox/msgbox.ref';
import { DomUtil } from 'app/util/dom-util';
import { MsgBoxButtons } from 'app/enums/msgbox-buttons';
import { MsgBoxIcon } from 'app/enums/msgbox-icon';
import { MsgBoxResult } from 'app/enums/msgbox-result';

@Component({
  selector: 'hc-msgbox',
  templateUrl: './msgbox.component.html',
  styleUrls: ['./msgbox.component.scss']
})
export class MsgBoxComponent implements OnInit, AfterViewInit {

  @ViewChild('footer')
  public footer: ElementRef;

  public title: string;
  public message: string;
  public icon: MsgBoxIcon;
  public iconType: typeof MsgBoxIcon = MsgBoxIcon;
  public buttons: MsgBoxButtons;
  public buttonsType: typeof MsgBoxButtons = MsgBoxButtons;
  public sizeStyle: any;

  private formId: string;
  private id: string;

  constructor(
    private titleService: TitleService,
    private eventsService: EventsService,
    private msgBoxRef: MsgBoxRef,
    @Inject(MSGBOX_DATA) message: IMsgBoxMessage
  ) {
    this.formId = message.formId;
    this.id = message.id;
    this.title = this.titleService.getTitle();
    this.message = message.message;
    this.icon = message.icon;
    this.buttons = message.buttons;
  }

  public ngOnInit(): void {
    this.refreshSizeStyle();
  }

  public ngAfterViewInit(): void {
    setTimeout(() => this.footer.nativeElement.focus(), 0);
  }

  public onYesClick(event: any): void {
    this.eventsService.fireMsgBox(this.formId, this.id, MsgBoxResult.Yes, event);
    this.msgBoxRef.close();
  }

  public onNoClick(event: any): void {
    this.eventsService.fireMsgBox(this.formId, this.id, MsgBoxResult.No, event);
    this.msgBoxRef.close();
  }

  public onOkClick(event: any): void {
    this.eventsService.fireMsgBox(this.formId, this.id, MsgBoxResult.Ok, event);
    this.msgBoxRef.close();
  }

  public onAbortClick(event: any): void {
    this.eventsService.fireMsgBox(this.formId, this.id, MsgBoxResult.Abort, event);
    this.msgBoxRef.close();
  }

  public onRetryClick(event: any): void {
    this.eventsService.fireMsgBox(this.formId, this.id, MsgBoxResult.Retry, event);
    this.msgBoxRef.close();
  }

  public onIgnoreClick(event: any): void {
    this.eventsService.fireMsgBox(this.formId, this.id, MsgBoxResult.Ignore, event);
    this.msgBoxRef.close();
  }

  public onCancelClick(event: any): void {
    this.eventsService.fireMsgBox(this.formId, this.id, MsgBoxResult.Cancel, event);
    this.msgBoxRef.close();
  }

  @HostListener('window:resize')
  public refreshSizeStyle(): void {
    const vpWidth: number = DomUtil.getViewportWidth();
    const vpHeight: number = DomUtil.getViewportHeight();

    this.sizeStyle = {
      'min-width.px': Math.min(400, vpWidth * 0.9),
      'max-width.px': Math.min(900, vpWidth * 0.9),
      'max-height.px': vpHeight * 0.9
    };
  }
}

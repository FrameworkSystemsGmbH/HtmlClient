import { Component, Inject, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ISubscription } from 'rxjs/Subscription';

import { EventsService } from 'app/services/events.service';
import { MsgBoxButtons } from 'app/enums/msgbox-buttons';
import { MsgBoxIcon } from 'app/enums/msgbox-icon';
import { MsgBoxResult } from 'app/enums/msgbox-result';

@Component({
  selector: 'hc-msgbox',
  templateUrl: './msgbox.component.html',
  styleUrls: ['./msgbox.component.scss']
})
export class MsgBoxComponent implements OnInit, OnDestroy {

  @ViewChild('footer')
  public footer: ElementRef;

  public title: string;
  public message: string;
  public icon: MsgBoxIcon;
  public iconType: typeof MsgBoxIcon = MsgBoxIcon;
  public buttons: MsgBoxButtons;
  public buttonsType: typeof MsgBoxButtons = MsgBoxButtons;

  private formId: string;
  private id: string;

  private afterOpenSub: ISubscription;

  constructor(
    private titleService: Title,
    private eventsService: EventsService,
    private dialogRef: MatDialogRef<MsgBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formId = data.formId;
    this.id = data.id;
    this.title = this.titleService.getTitle();
    this.message = data.message;
    this.icon = data.icon;
    this.buttons = data.buttons;
  }

  public ngOnInit(): void {
    this.afterOpenSub = this.dialogRef.afterOpen().subscribe(() => {
      setTimeout(() => this.footer.nativeElement.focus());
    });
  }

  public ngOnDestroy(): void {
    if (this.afterOpenSub) {
      this.afterOpenSub.unsubscribe();
    }
  }

  public onYesClick(event: any): void {
    this.eventsService.fireMsgBox(this.formId, this.id, MsgBoxResult.Yes, event);
    this.dialogRef.close();
  }

  public onNoClick(event: any): void {
    this.eventsService.fireMsgBox(this.formId, this.id, MsgBoxResult.No, event);
    this.dialogRef.close();
  }

  public onOkClick(event: any): void {
    this.eventsService.fireMsgBox(this.formId, this.id, MsgBoxResult.Ok, event);
    this.dialogRef.close();
  }

  public onAbortClick(event: any): void {
    this.eventsService.fireMsgBox(this.formId, this.id, MsgBoxResult.Abort, event);
    this.dialogRef.close();
  }

  public onRetryClick(event: any): void {
    this.eventsService.fireMsgBox(this.formId, this.id, MsgBoxResult.Retry, event);
    this.dialogRef.close();
  }

  public onIgnoreClick(event: any): void {
    this.eventsService.fireMsgBox(this.formId, this.id, MsgBoxResult.Ignore, event);
    this.dialogRef.close();
  }

  public onCancelClick(event: any): void {
    this.eventsService.fireMsgBox(this.formId, this.id, MsgBoxResult.Cancel, event);
    this.dialogRef.close();
  }
}

import { Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormsService } from '@app/services/forms.service';
import { FramesService } from '@app/services/frames.service';
import { FormWrapper } from '@app/wrappers/form-wrapper';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hc-frame',
  templateUrl: './frame.component.html',
  styleUrls: ['./frame.component.scss']
})
export class FrameComponent implements OnInit, OnDestroy {

  @ViewChild('frame', { static: true })
  public frame: ElementRef;

  @ViewChild('anchor', { read: ViewContainerRef, static: true })
  public anchor: ViewContainerRef;

  private _selectedForm: FormWrapper;
  private _selectedFormSub: Subscription;

  public constructor(
    private readonly _zone: NgZone,
    private readonly _formsService: FormsService,
    private readonly _framesService: FramesService
  ) { }

  @HostListener('window:resize')
  public layout(): void {
    this._zone.run(() => {
      if (this._selectedForm) {
        this._selectedForm.doLayout(this.frame.nativeElement.clientWidth, this.frame.nativeElement.clientHeight);
      }
    });
  }

  public ngOnInit(): void {
    this._framesService.registerFrame(this);

    this._selectedFormSub = this._formsService.getSelectedForm().subscribe(form => {
      this.showForm(form);
    });

    this._formsService.fireSelectCurrentForm();
  }

  public ngOnDestroy(): void {
    if (this._selectedFormSub) {
      this._selectedFormSub.unsubscribe();
    }
  }

  private showForm(form: FormWrapper): void {
    this.anchor.clear();
    if (form) {
      this._selectedForm = form;
      this._selectedForm.attachComponentToFrame(this.anchor);
      setTimeout(() => this.layout());
    } else {
      this._selectedForm = null;
    }
  }
}

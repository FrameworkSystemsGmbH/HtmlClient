import { Component, ViewChild, ElementRef, ViewContainerRef, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';

import { FormsService } from 'app/services/forms.service';
import { FramesService } from 'app/services/frames.service';
import { FormWrapper } from 'app/wrappers/form-wrapper';

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

  private selectedForm: FormWrapper;
  private selectedFormSub: Subscription;

  constructor(
    private formsService: FormsService,
    private framesService: FramesService
  ) { }

  public ngOnInit(): void {
    this.framesService.registerFrame(this);

    this.selectedFormSub = this.formsService.getSelectedForm().subscribe(form => {
      this.showForm(form);
    });

    this.formsService.fireSelectCurrentForm();
  }

  public ngOnDestroy(): void {
    if (this.selectedFormSub) {
      this.selectedFormSub.unsubscribe();
    }
  }

  @HostListener('window:resize')
  public layout(): void {
    if (this.selectedForm) {
      this.selectedForm.doLayout(this.frame.nativeElement.clientWidth, this.frame.nativeElement.clientHeight);
    }
  }

  private showForm(form: FormWrapper): void {
    this.anchor.clear();
    if (form) {
      this.selectedForm = form;
      this.selectedForm.attachComponentToFrame(this.anchor);
      setTimeout(() => this.layout());
    } else {
      this.selectedForm = null;
    }
  }
}

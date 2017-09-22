import { Component, ViewChild, ElementRef, ViewContainerRef, OnInit, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';
import { FormsService } from '../../services/forms.service';
import { FormWrapper } from '../../wrappers';

@Component({
  selector: 'hc-frame',
  templateUrl: './frame.component.html',
  styleUrls: ['./frame.component.scss']
})
export class FrameComponent implements OnInit, OnDestroy {

  @ViewChild('frame') frame: ElementRef;
  @ViewChild('anchor', { read: ViewContainerRef }) anchor: ViewContainerRef;

  private selectedForm: FormWrapper;
  private selectedFormSub: ISubscription;

  constructor(
    private cd: ChangeDetectorRef,
    private formsService: FormsService) { }

  public ngOnInit(): void {
    this.selectedFormSub = this.formsService.formSelected.subscribe(form => { this.showForm(form); });
    this.formsService.fireSelectCurrentForm();
  }

  public ngOnDestroy(): void {
    this.selectedFormSub.unsubscribe();
  }

  @HostListener('window:resize')
  private layout(): void {
    if (this.selectedForm) {
      let availableWidth: number = this.frame.nativeElement.clientWidth;
      let availableHeight: number = this.frame.nativeElement.clientHeight;
      this.selectedForm.doLayout(availableWidth, availableHeight);
    }

    this.cd.detectChanges();
  }

  private showForm(form: FormWrapper): void {
    this.anchor.clear();
    if (form) {
      this.selectedForm = form;
      this.selectedForm.attachComponentToFrame(this.anchor);
      this.layout();
    } else {
      this.selectedForm = null;
    }
  }
}

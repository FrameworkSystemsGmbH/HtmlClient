import { Component, ViewChild, ViewContainerRef, OnInit, AfterViewInit } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';
import { FormsService } from '../../services/forms.service';
import { FormWrapper } from '../../wrappers';

@Component({
  selector: 'hc-frame',
  templateUrl: './frame.component.html',
  styleUrls: ['./frame.component.scss']
})
export class FrameComponent implements OnInit, AfterViewInit {

  @ViewChild('anchor', { read: ViewContainerRef }) anchor: ViewContainerRef;

  private selectedForm: FormWrapper;
  private selectedFormSub: ISubscription;

  constructor(private formsService: FormsService) { }

  public ngOnInit(): void {
    this.selectedFormSub = this.formsService.formSelected.subscribe(form => { this.showForm(form); });
    this.formsService.fireSelectCurrentForm();
  }

  public ngAfterViewInit(): void {
    this.selectedForm.doLayout();
  }

  private showForm(form: FormWrapper): void {
    this.anchor.clear();
    this.selectedForm = form;
    form.attachComponentToFrame(this.anchor);
  }
}

import { Component, ViewChild, ViewContainerRef, OnInit } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';
import { FormsService } from '../../services/forms.service';
import { FormWrapper } from '../../wrappers';

@Component({
  selector: 'hc-frame',
  templateUrl: './frame.component.html',
  styleUrls: ['./frame.component.scss']
})
export class FrameComponent implements OnInit {

  @ViewChild('anchor', { read: ViewContainerRef }) anchor: ViewContainerRef;

  private selectedFormSub: ISubscription;

  constructor(private formsService: FormsService) {}

  public ngOnInit(): void {
    this.selectedFormSub = this.formsService.formSelected.subscribe(form => { this.showForm(form); });
    this.formsService.fireSelectCurrentForm();
  }

  private showForm(form: FormWrapper): void {
    this.anchor.clear();
    form.attachComponentToFrame(this.anchor);
    form.doLayout();
  }

}

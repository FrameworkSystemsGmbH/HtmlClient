import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsService } from 'app/services/forms.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hc-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit, OnDestroy {

  public isModal: boolean;
  public modalHeaderStyle: any;

  private _selectedFormSub: Subscription;

  constructor(private _formsService: FormsService) { }

  public ngOnInit(): void {
    this._selectedFormSub = this._formsService.getSelectedForm().subscribe(form => {
      this.isModal = form != null ? form.getIsModal() : false;
      this.modalHeaderStyle = { 'display': (form != null ? form.hideModalHeader() : false) ? 'none' : null };
    });
  }

  public ngOnDestroy(): void {
    if (this._selectedFormSub) {
      this._selectedFormSub.unsubscribe();
    }
  }
}

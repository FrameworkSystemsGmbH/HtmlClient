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
  public hideModalHeader: boolean;

  private _selectedFormSub: Subscription;

  constructor(private _formsService: FormsService) { }

  public ngOnInit(): void {
    this._selectedFormSub = this._formsService.getSelectedForm().subscribe(form => {
      this.isModal = form != null ? form.getIsModal() : false;
      this.hideModalHeader = form != null ? form.hideModalHeader() : false;
    });
  }

  public ngOnDestroy(): void {
    if (this._selectedFormSub) {
      this._selectedFormSub.unsubscribe();
    }
  }
}

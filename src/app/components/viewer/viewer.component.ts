import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsService } from '@app/services/forms.service';
import { LoaderService } from '@app/services/loader.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hc-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit, OnDestroy {

  public isModal: boolean;
  public isLoading: boolean;
  public modalHeaderStyle: any;

  private _selectedFormSub: Subscription;
  private _loadingChangedSub: Subscription;

  public constructor(
    private readonly _formsService: FormsService,
    private readonly _loaderService: LoaderService
  ) { }

  public ngOnInit(): void {
    this._selectedFormSub = this._formsService.getSelectedForm().subscribe(form => {
      this.isModal = form != null ? form.getIsModal() : false;
      this.modalHeaderStyle = { 'display': (form != null ? form.hideModalHeader() : false) ? 'none' : null };
    });

    this._loadingChangedSub = this._loaderService.onLoadingChangedDelayed.subscribe(loading => {
      this.isLoading = loading;
    });
  }

  public ngOnDestroy(): void {
    if (this._selectedFormSub) {
      this._selectedFormSub.unsubscribe();
    }

    if (this._loadingChangedSub) {
      this._loadingChangedSub.unsubscribe();
    }
  }
}

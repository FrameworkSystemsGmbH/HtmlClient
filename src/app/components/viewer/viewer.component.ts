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

  public isModal: boolean = false;
  public isLoading: boolean = false;
  public modalHeaderStyle: any;

  private readonly _formsService: FormsService;
  private readonly _loaderService: LoaderService;

  private _selectedFormSub: Subscription | null = null;
  private _loadingChangedSub: Subscription | null = null;

  public constructor(
    formsService: FormsService,
    loaderService: LoaderService
  ) {
    this._formsService = formsService;
    this._loaderService = loaderService;
  }

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

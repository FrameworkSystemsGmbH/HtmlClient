import { Component, OnDestroy, OnInit } from '@angular/core';
import { ViewerHeader } from '@app/components/viewer/viewer.header';
import { FormsService } from '@app/services/forms.service';
import { LoaderService } from '@app/services/loader.service';
import { IAppState } from '@app/store/app.state';
import { selectDisableFormNavigation } from '@app/store/runtime/runtime.selectors';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'hc-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit, OnDestroy {

  public isLoading: boolean = false;
  public header: ViewerHeader = ViewerHeader.Normal;
  public headerType = ViewerHeader;

  private readonly _formsService: FormsService;
  private readonly _loaderService: LoaderService;
  private readonly _store: Store<IAppState>;

  private _isModal: boolean = false;
  private _hideModalHeader: boolean = false;
  private _disableFormNav: boolean = false;

  private _disableFormNavSub: Subscription | null = null;
  private _selectedFormSub: Subscription | null = null;
  private _loadingChangedSub: Subscription | null = null;

  public constructor(
    formsService: FormsService,
    loaderService: LoaderService,
    store: Store<IAppState>
  ) {
    this._formsService = formsService;
    this._loaderService = loaderService;
    this._store = store;
  }

  public ngOnInit(): void {
    this._disableFormNavSub = this._store.select(selectDisableFormNavigation).subscribe(disableFormNav => {
      this._disableFormNav = disableFormNav;
      this.updateHeader();
    });

    this._selectedFormSub = this._formsService.getSelectedForm().subscribe(form => {
      this._isModal = form != null ? form.getIsModal() : false;
      this._hideModalHeader = form != null ? form.hideModalHeader() : false;
      this.updateHeader();
    });

    this._loadingChangedSub = this._loaderService.onLoadingChangedDelayed.subscribe(loading => {
      this.isLoading = loading;
    });
  }

  public ngOnDestroy(): void {
    this._disableFormNavSub?.unsubscribe();
    this._selectedFormSub?.unsubscribe();
    this._loadingChangedSub?.unsubscribe();
  }

  private updateHeader(): void {
    if (this._hideModalHeader) {
      this.header = ViewerHeader.None;
    } else if (this._isModal) {
      this.header = ViewerHeader.Modal;
    } else if (this._disableFormNav) {
      this.header = ViewerHeader.Disabled;
    } else {
      this.header = ViewerHeader.Normal;
    }
  }
}

import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BlockerComponent } from '@app/components/blocker/blocker.component';
import { FrameComponent } from '@app/components/frame/frame.component';
import { DisabledHeaderComponent } from '@app/components/header/disabled/disabled-header.component';
import { ModalHeaderComponent } from '@app/components/header/modal/modal-header.component';
import { NormalHeaderComponent } from '@app/components/header/normal/normal-header.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { ViewerHeader } from '@app/components/viewer/viewer.header';
import { FormsService } from '@app/services/forms.service';
import { LoaderService } from '@app/services/loader.service';
import { IAppState } from '@app/store/app.state';
import { selectDisableFormNavigation } from '@app/store/runtime/runtime.selectors';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

/**
 * Clientteil, welcher Header, Menu, Client-Applikation anzeigt.
 */
@Component({
  selector: 'hc-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
  imports: [
    BlockerComponent,
    DisabledHeaderComponent,
    FrameComponent,
    ModalHeaderComponent,
    NormalHeaderComponent,
    SidebarComponent
  ]
})
export class ViewerComponent implements OnInit, OnDestroy {

  public isLoading: boolean = false;
  public header: ViewerHeader = ViewerHeader.Normal;
  public headerType = ViewerHeader;

  private readonly _formsService = inject(FormsService);
  private readonly _loaderService = inject(LoaderService);
  private readonly _store = inject(Store<IAppState>);

  private _isModal: boolean = false;
  private _hideModalHeader: boolean = false;
  private _disableFormNav: boolean = false;

  private _disableFormNavSub: Subscription | null = null;
  private _selectedFormSub: Subscription | null = null;
  private _loadingChangedSub: Subscription | null = null;

  public ngOnInit(): void {
    this._disableFormNavSub = this._store.select(selectDisableFormNavigation).subscribe({
      next: disableFormNav => {
        this._disableFormNav = disableFormNav;
        this.updateHeader();
      }
    });

    this._selectedFormSub = this._formsService.getSelectedForm().subscribe({
      next: form => {
        this._isModal = form != null ? form.getIsModal() : false;
        this._hideModalHeader = form != null ? form.hideModalHeader() : false;
        this.updateHeader();
      }
    });

    this._loadingChangedSub = this._loaderService.onLoadingChangedDelayed.subscribe({
      next: loading => {
        this.isLoading = loading;
      }
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

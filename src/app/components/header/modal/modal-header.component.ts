import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { FormWrapper } from 'app/wrappers/form-wrapper';
import { FormsService } from 'app/services/forms.service';
import { LoaderService } from 'app/services/loader.service';
import { BackService } from 'app/services/back-service';
import { BackButtonPriority } from 'app/enums/backbutton-priority';

@Component({
  selector: 'hc-modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: ['./modal-header.component.scss']
})
export class ModalHeaderComponent implements OnInit, OnDestroy {

  public isLoading: boolean = false;

  private _form: FormWrapper;
  private _selectedFormSub: Subscription;
  private _loadingChangedSub: Subscription;

  private onBackButtonListener: () => boolean;

  constructor(
    private _backService: BackService,
    private _loaderService: LoaderService,
    private _formsService: FormsService
  ) { }

  public ngOnInit(): void {
    this.onBackButtonListener = this.onBackButton.bind(this);
    this._backService.addBackButtonListener(this.onBackButtonListener, BackButtonPriority.ModalDialog);

    this._selectedFormSub = this._formsService.getSelectedForm().subscribe(form => this._form = form);
    this._loadingChangedSub = this._loaderService.onLoadingChangedDelayed.subscribe(loading => this.isLoading = loading);
  }

  public ngOnDestroy(): void {
    if (this.onBackButtonListener) {
      this._backService.removeBackButtonListener(this.onBackButtonListener);
    }

    if (this._selectedFormSub) {
      this._selectedFormSub.unsubscribe();
    }

    if (this._loadingChangedSub) {
      this._loadingChangedSub.unsubscribe();
    }
  }

  private onBackButton(): boolean {
    if (this._form.isCloseIconVisible() || this._form.getCloseButton()) {
      this.closeForm();
    }

    return true;
  }

  public getTitle(): string {
    return this._form ? this._form.getTitle() : null;
  }

  public getIsCloseIconVisible(): boolean {
    return this._form ? this._form.isCloseIconVisible() : null;
  }

  public closeForm(): void {
    this._formsService.closeFormByButton(this._form);
  }
}

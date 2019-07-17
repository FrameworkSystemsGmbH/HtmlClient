import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { FormWrapper } from 'app/wrappers/form-wrapper';
import { FormsService } from 'app/services/forms.service';
import { LoaderService } from 'app/services/loader.service';

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

  constructor(
    private loaderService: LoaderService,
    private formsService: FormsService
  ) { }

  public ngOnInit(): void {
    this._selectedFormSub = this.formsService.getSelectedForm().subscribe(form => this._form = form);
    this._loadingChangedSub = this.loaderService.onLoadingChangedDelayed.subscribe(loading => this.isLoading = loading);
  }

  public ngOnDestroy(): void {
    if (this._selectedFormSub) {
      this._selectedFormSub.unsubscribe();
    }

    if (this._loadingChangedSub) {
      this._loadingChangedSub.unsubscribe();
    }
  }

  public getTitle(): string {
    return this._form ? this._form.getTitle() : null;
  }

  public getIsCloseIconVisible(): boolean {
    return this._form ? this._form.isCloseIconVisible() : null;
  }

  public closeForm(): void {
    this.formsService.closeForm(this._form);
  }
}

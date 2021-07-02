import { Component, OnDestroy, OnInit } from '@angular/core';
import { BackButtonPriority } from '@app/enums/backbutton-priority';
import { BackService } from '@app/services/back-service';
import { FormsService } from '@app/services/forms.service';
import { FormWrapper } from '@app/wrappers/form-wrapper';
import { faTimes, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hc-modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: ['./modal-header.component.scss']
})
export class ModalHeaderComponent implements OnInit, OnDestroy {

  public iconTimes: IconDefinition = faTimes;

  private readonly _backService: BackService;
  private readonly _formsService: FormsService;

  private _form: FormWrapper | null = null;
  private _selectedFormSub: Subscription | null = null;

  private onBackButtonListener: (() => boolean) | null = null;

  public constructor(
    backService: BackService,
    formsService: FormsService
  ) {
    this._backService = backService;
    this._formsService = formsService;
  }

  public ngOnInit(): void {
    this.onBackButtonListener = this.onBackButton.bind(this);
    this._backService.addBackButtonListener(this.onBackButtonListener, BackButtonPriority.ModalDialog);

    this._selectedFormSub = this._formsService.getSelectedForm().subscribe(form => {
      this._form = form;
    });
  }

  public ngOnDestroy(): void {
    if (this.onBackButtonListener) {
      this._backService.removeBackButtonListener(this.onBackButtonListener);
    }

    if (this._selectedFormSub) {
      this._selectedFormSub.unsubscribe();
    }
  }

  private onBackButton(): boolean {
    if (this._form != null && (this._form.isCloseIconVisible() || this._form.getCloseButton())) {
      this.closeForm();
    }

    return true;
  }

  public getTitle(): string | null {
    return this._form ? this._form.getTitle() : null;
  }

  public getIsCloseIconVisible(): boolean {
    return this._form ? this._form.isCloseIconVisible() : false;
  }

  public closeForm(): void {
    if (this._form != null) {
      this._formsService.closeFormByButton(this._form);
    }
  }
}

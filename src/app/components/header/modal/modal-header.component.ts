import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { BackButtonPriority } from '@app/enums/backbutton-priority';
import { BackService } from '@app/services/back-service';
import { FormsService } from '@app/services/forms.service';
import { IAppState } from '@app/store/app.state';
import { selectDisableFormNavigation } from '@app/store/runtime/runtime.selectors';
import { FormWrapper } from '@app/wrappers/form-wrapper';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'hc-modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: ['./modal-header.component.scss'],
  imports: [
    CommonModule,
    FontAwesomeModule
  ]
})
export class ModalHeaderComponent implements OnInit, OnDestroy {

  public iconTimes: IconDefinition = faTimes;
  public isCloseIconVisible: boolean = false;

  private readonly _backService: BackService;
  private readonly _formsService: FormsService;
  private readonly _store: Store<IAppState>;

  private _form: FormWrapper | null = null;
  private _formSub: Subscription | null = null;

  private _disableFormNav: boolean = false;
  private _disableFormNavSub: Subscription | null = null;

  private onBackButtonListener: (() => boolean) | null = null;

  public constructor(
    backService: BackService,
    formsService: FormsService,
    store: Store<IAppState>
  ) {
    this._backService = backService;
    this._formsService = formsService;
    this._store = store;
  }

  public ngOnInit(): void {
    this.onBackButtonListener = this.onBackButton.bind(this);
    this._backService.addBackButtonListener(this.onBackButtonListener, BackButtonPriority.ModalDialog);

    this._disableFormNavSub = this._store.select(selectDisableFormNavigation).subscribe({
      next: disableFormNav => {
        this._disableFormNav = disableFormNav;
        this.updateIsCloseIconVisible();
      }
    });

    this._formSub = this._formsService.getSelectedForm().subscribe({
      next: form => {
        this._form = form;
        this.updateIsCloseIconVisible();
      }
    });
  }

  public ngOnDestroy(): void {
    this._disableFormNavSub?.unsubscribe();
    this._formSub?.unsubscribe();

    if (this.onBackButtonListener) {
      this._backService.removeBackButtonListener(this.onBackButtonListener);
    }
  }

  private updateIsCloseIconVisible(): void {
    if (this._disableFormNav) {
      this.isCloseIconVisible = false;
    } else {
      this.isCloseIconVisible = this._form != null ? this._form.isCloseIconVisible() : false;
    }
  }

  private onBackButton(): boolean {
    if (this._form != null && (this._form.isCloseIconVisible() || this._form.getCloseButton())) {
      this.closeForm();
    }

    return true;
  }

  public getFormTitle(): string | null {
    return this._form != null ? this._form.getTitle() : null;
  }

  public getFormBgColor(): string | null {
    return this._form != null ? this._form.getBackColor() : null;
  }

  public getBadgeImageSrc(): SafeUrl | null {
    return this._form != null ? this._form.getBadgeImageSrc() : null;
  }

  public closeForm(): void {
    if (this._form != null) {
      this._formsService.closeFormByButton(this._form);
    }
  }
}

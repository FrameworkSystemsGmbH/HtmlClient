import { Component, OnDestroy, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { EventsService } from '@app/services/events.service';
import { FormsService } from '@app/services/forms.service';
import { IAppState } from '@app/store/app.state';
import { selectBrokerDirect } from '@app/store/broker/broker.selectors';
import { selectTitle } from '@app/store/runtime/runtime.selectors';
import { FormWrapper } from '@app/wrappers/form-wrapper';
import { faSignOutAlt, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hc-disabled-header',
  templateUrl: './disabled-header.component.html',
  styleUrls: ['./disabled-header.component.scss']
})
export class DisabledHeaderComponent implements OnInit, OnDestroy {

  public iconSignOut: IconDefinition = faSignOutAlt;
  public appTitle: string | null = null;
  public showCompact: boolean = false;
  public disabledAttr: boolean | null = null;

  private readonly _eventsService: EventsService;
  private readonly _formsService: FormsService;
  private readonly _store: Store<IAppState>;

  private _form: FormWrapper | null = null;

  private _directSub: Subscription | null = null;
  private _titleSub: Subscription | null = null;
  private _formSub: Subscription | null = null;

  public constructor(
    eventsService: EventsService,
    formsService: FormsService,
    store: Store<IAppState>
  ) {
    this._eventsService = eventsService;
    this._formsService = formsService;
    this._store = store;
  }

  public ngOnInit(): void {
    this._directSub = this._store.select(selectBrokerDirect).subscribe(direct => {
      this.disabledAttr = Boolean.nullIfFalse(direct);
    });

    this._titleSub = this._store.select(selectTitle).subscribe(title => {
      this.appTitle = title;
    });

    this._formSub = this._formsService.getSelectedForm().subscribe(form => {
      this._form = form;
    });
  }

  public ngOnDestroy(): void {
    this._directSub?.unsubscribe();
    this._titleSub?.unsubscribe();
    this._formSub?.unsubscribe();
  }

  public mediaQueryChanged(matches: boolean): void {
    this.showCompact = !matches;
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

  public switchBroker(): void {
    this._eventsService.fireApplicationQuitRequest();
  }
}

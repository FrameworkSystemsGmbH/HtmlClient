import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, UntypedFormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LastSessionInfo } from '@app/common/last-session-info';
import { LoginBroker } from '@app/common/login-broker';
import { DialogResizeDirective } from '@app/directives/dialog-resize.directive';
import { BrokerService } from '@app/services/broker.service';
import { LoginService } from '@app/services/login.service';
import { StateService } from '@app/services/state.service';
import { IAppState } from '@app/store/app.state';
import { selectBrokerName } from '@app/store/broker/broker.selectors';
import { setTitleDefault } from '@app/store/runtime/runtime.actions';
import * as DomUtil from '@app/util/dom-util';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition, faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'hc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    CommonModule,
    DialogResizeDirective,
    FontAwesomeModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  public iconPlus: IconDefinition = faPlus;
  public iconEdit: IconDefinition = faEdit;
  public iconTrash: IconDefinition = faTrash;

  public brokers$: Observable<Array<LoginBroker>> | null = null;
  public lastSessionInfo: LastSessionInfo | null = null;
  public activeBrokerName: string | null = null;
  public editorShown: boolean = false;
  public editingExisting: boolean = false;

  public nameControl: FormControl<string | null> = new FormControl<string | null>(null);
  public urlControl: FormControl<string | null> = new FormControl<string | null>(null, Validators.required.bind(this));
  public addForm: FormGroup = new FormGroup({
    name: this.nameControl,
    url: this.urlControl
  });

  private readonly _loginService: LoginService;
  private readonly _brokerService: BrokerService;
  private readonly _stateService: StateService;
  private readonly _store: Store<IAppState>;

  private _brokerValidator: any;
  private _activeBrokerNameSub: Subscription | null = null;

  public constructor(
    loginService: LoginService,
    brokerService: BrokerService,
    stateService: StateService,
    store: Store<IAppState>
  ) {
    this._loginService = loginService;
    this._brokerService = brokerService;
    this._stateService = stateService;
    this._store = store;
  }

  public ngOnInit(): void {
    this._brokerValidator = this.createBrokerValidator(this._loginService);

    this.brokers$ = this._loginService.getBrokers();

    this._activeBrokerNameSub = this._store.select(selectBrokerName).subscribe({
      next: name => {
        this.activeBrokerName = name;
      }
    });

    this.lastSessionInfo = this._stateService.getLastSessionInfo();

    if (this.activeBrokerName == null || this.activeBrokerName.trim().length === 0) {
      this._store.dispatch(setTitleDefault());
    }
  }

  public ngOnDestroy(): void {
    this._activeBrokerNameSub?.unsubscribe();
  }

  public getLastRequestTimeLocalString(): string | null {
    return this.lastSessionInfo != null ? this.lastSessionInfo.getLastRequestTime().local().format('L LTS') : null;
  }

  public continueSession(): void {
    if (this.lastSessionInfo) {
      this._stateService.loadState(this.lastSessionInfo);
    }
  }

  public openEditorNew(): void {
    this.nameControl.setValidators(Validators.required.bind(this));
    this.nameControl.setAsyncValidators(this._brokerValidator);
    this.editingExisting = false;
    this.editorShown = true;
  }

  public openEditorUpdate(broker: LoginBroker): void {
    if (broker.name === this.activeBrokerName) {
      return;
    }

    this.nameControl.setValidators(Validators.required.bind(this));
    this.nameControl.clearAsyncValidators();
    this.nameControl.setValue(broker.name);
    this.urlControl.setValue(broker.url);
    this.editingExisting = true;
    this.editorShown = true;
  }

  public exitEditor(): void {
    this.addForm.reset();
    this.editorShown = false;
    this.editingExisting = false;
  }

  public saveBroker(): void {
    if (this.nameControl.value != null && this.urlControl.value != null) {
      this._loginService.addOrUpdateBroker(new LoginBroker(this.nameControl.value, this.urlControl.value));
      this.addForm.reset();
      this.exitEditor();
    }
  }

  public deleteBroker(broker: LoginBroker): void {
    if (broker.name !== this.activeBrokerName) {
      this._loginService.deleteBroker(broker);
    }
  }

  public loadBroker(event: any, broker: LoginBroker): void {
    if (broker.name === this.activeBrokerName && event.target && DomUtil.isInClass(event.target, 'broker-actions')) {
      return;
    }

    this._brokerService.login(broker, false);
  }

  private createBrokerValidator(ls: LoginService): any {
    return (c: UntypedFormControl): Observable<any> => new Observable<any>(subscriber => {
      ls.getBrokers().subscribe({
        next: brokers => {
          if (brokers.length > 0 && brokers.find(b => String.equals(b.name, c.value, true))) {
            subscriber.next({ broker: true });
          } else {
            subscriber.next(null);
          }
          subscriber.complete();
        }
      });
    });
  }
}

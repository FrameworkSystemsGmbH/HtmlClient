import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LastSessionInfo } from '@app/common/last-session-info';
import { LoginBroker } from '@app/common/login-broker';
import { BrokerService } from '@app/services/broker.service';
import { LoginService } from '@app/services/login.service';
import { StateService } from '@app/services/state.service';
import { TitleService } from '@app/services/title.service';
import { selectBrokerName } from '@app/store/broker/broker.selectors';
import * as DomUtil from '@app/util/dom-util';
import { faEdit, faPlus, faTrash, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'hc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  public iconPlus: IconDefinition = faPlus;
  public iconEdit: IconDefinition = faEdit;
  public iconTrash: IconDefinition = faTrash;

  public brokers$: Observable<Array<LoginBroker>>;
  public lastSessionInfo: LastSessionInfo;
  public activeBrokerName: string;
  public addForm: FormGroup;
  public nameControl: FormControl;
  public urlControl: FormControl;
  public editorShown: boolean;
  public editingExisting: boolean;

  private _brokerValidator: any;
  private _activeBrokerNameSub: Subscription;
  private _lastSessionInfoSub: Subscription;

  public constructor(
    private readonly _titleService: TitleService,
    private readonly _loginService: LoginService,
    private readonly _brokerService: BrokerService,
    private readonly _stateService: StateService,
    private readonly _store: Store) { }

  public ngOnInit(): void {
    this._brokerValidator = this.createBrokerValidator(this._loginService);

    this.brokers$ = this._loginService.getBrokers();

    this._activeBrokerNameSub = this._store.select(selectBrokerName).subscribe(name => {
      this.activeBrokerName = name;
    });

    this.nameControl = new FormControl(null);
    this.urlControl = new FormControl(null, Validators.required.bind(this));

    this.addForm = new FormGroup({
      name: this.nameControl,
      url: this.urlControl
    });

    this._lastSessionInfoSub = this._stateService.getLastSessionInfo().subscribe(lastSessionInfo => {
      this.lastSessionInfo = lastSessionInfo;
    });

    if (String.isNullOrWhiteSpace(this.activeBrokerName)) {
      this._titleService.setDefault();
    }
  }

  public ngOnDestroy(): void {
    if (this._activeBrokerNameSub) {
      this._activeBrokerNameSub.unsubscribe();
    }

    if (this._lastSessionInfoSub) {
      this._lastSessionInfoSub.unsubscribe();
    }
  }

  public getLastRequestTimeLocalString(): string {
    return this.lastSessionInfo != null ? this.lastSessionInfo.getLastRequestTime().local().format('L LTS') : null;
  }

  public continueSession(): void {
    this._stateService.loadState(this.lastSessionInfo);
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
    const broker: LoginBroker = new LoginBroker();
    broker.name = this.nameControl.value;
    broker.url = this.urlControl.value;

    this._loginService.addOrUpdateBroker(broker);

    this.addForm.reset();
    this.exitEditor();
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
    return (c: FormControl): Observable<any> => new Observable<any>(subscriber => {
      ls.getBrokers().subscribe(brokers => {
        if (brokers && brokers.length && brokers.find(b => String.equals(b.name, c.value, true))) {
          subscriber.next({ broker: true });
        } else {
          subscriber.next(null);
        }
        subscriber.complete();
      });
    });
  }
}

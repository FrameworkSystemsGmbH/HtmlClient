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

  private brokerValidator: any;
  private activeBrokerNameSub: Subscription;
  private lastSessionInfoSub: Subscription;

  constructor(
    private titleService: TitleService,
    private loginService: LoginService,
    private brokerService: BrokerService,
    private stateService: StateService,
    private store: Store) { }

  public ngOnInit(): void {
    this.brokerValidator = this.createBrokerValidator(this.loginService);

    this.brokers$ = this.loginService.getBrokers();

    this.activeBrokerNameSub = this.store.select(selectBrokerName).subscribe(name => {
      this.activeBrokerName = name;
    });

    this.nameControl = new FormControl(null);
    this.urlControl = new FormControl(null, Validators.required.bind(this));

    this.addForm = new FormGroup({
      name: this.nameControl,
      url: this.urlControl
    });

    this.lastSessionInfoSub = this.stateService.getLastSessionInfo().subscribe(lastSessionInfo => {
      this.lastSessionInfo = lastSessionInfo;
    });

    if (String.isNullOrWhiteSpace(this.activeBrokerName)) {
      this.titleService.setDefault();
    }
  }

  public ngOnDestroy(): void {
    if (this.activeBrokerNameSub) {
      this.activeBrokerNameSub.unsubscribe();
    }

    if (this.lastSessionInfoSub) {
      this.lastSessionInfoSub.unsubscribe();
    }
  }

  public getLastRequestTimeLocalString(): string {
    return this.lastSessionInfo != null ? this.lastSessionInfo.getLastRequestTime().local().format('L LTS') : null;
  }

  public continueSession(): void {
    this.stateService.loadState(this.lastSessionInfo);
  }

  public openEditorNew(): void {
    this.nameControl.setValidators(Validators.required.bind(this));
    this.nameControl.setAsyncValidators(this.brokerValidator);
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

    this.loginService.addOrUpdateBroker(broker);

    this.addForm.reset();
    this.exitEditor();
  }

  public deleteBroker(broker: LoginBroker): void {
    if (broker.name !== this.activeBrokerName) {
      this.loginService.deleteBroker(broker);
    }
  }

  public loadBroker(event: any, broker: LoginBroker): void {
    if (broker.name === this.activeBrokerName && event.target && DomUtil.isInClass(event.target, 'broker-actions')) {
      return;
    }

    this.brokerService.login(broker, false);
  }

  private createBrokerValidator(ls: LoginService): any {
    return (c: FormControl) => new Observable<any>(subscriber => {
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

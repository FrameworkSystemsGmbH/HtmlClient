import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ISubscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

import { IAppState } from 'app/app.reducers';

import { LoginBroker } from 'app/common/login-broker';
import { LoginService } from 'app/services/login.service';
import { BrokerService } from 'app/services/broker.service';
import { SerializeService } from 'app/services/serialize.service';
import { LastSessionInfo } from 'app/common/last-session-info';
import { DomUtil } from 'app/util/dom-util';

@Component({
  selector: 'hc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  public brokers$: Observable<Array<LoginBroker>>;
  public lastSessionInfo: LastSessionInfo;
  public activeBrokerName: string;
  public addForm: FormGroup;
  public nameControl: FormControl;
  public urlControl: FormControl;
  public devControl: FormControl;
  public editorShown: boolean;
  public editingIndex: number;

  private brokerValidator: any;
  private activeBrokerNameSub: ISubscription;
  private lastSessionInfoSub: ISubscription;

  constructor(
    private loginService: LoginService,
    private brokerService: BrokerService,
    private serializeService: SerializeService,
    private store: Store<IAppState>) { }

  public ngOnInit(): void {
    this.brokerValidator = this.createBrokerValidator(this.loginService);

    this.brokers$ = this.loginService.getBrokers();
    this.activeBrokerNameSub = this.store.select(appState => appState.broker.activeBrokerName).subscribe(name => {
      this.activeBrokerName = name;
    });

    this.nameControl = new FormControl(null);
    this.urlControl = new FormControl(null, Validators.required);
    this.devControl = new FormControl(null);

    this.addForm = new FormGroup({
      name: this.nameControl,
      url: this.urlControl,
      dev: this.devControl
    });

    this.lastSessionInfoSub = this.serializeService.getLastSessionInfo().subscribe(lastSessionInfo => {
      this.lastSessionInfo = lastSessionInfo;
    });
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
    this.serializeService.onResume();
  }

  public openEditorNew(): void {
    this.nameControl.setValidators(Validators.required);
    this.nameControl.setAsyncValidators(this.brokerValidator);
    this.editingIndex = null;
    this.editorShown = true;
  }

  public openEditorUpdate(index: number, broker: LoginBroker): void {
    if (broker.name === this.activeBrokerName) {
      return;
    }

    this.nameControl.setValidators(Validators.required);
    this.nameControl.clearAsyncValidators();
    this.editingIndex = index;
    this.nameControl.setValue(broker.name);
    this.urlControl.setValue(broker.url);
    this.devControl.setValue(broker.dev);
    this.editorShown = true;
  }

  public exitEditor(): void {
    this.addForm.reset();
    this.editorShown = false;
    this.editingIndex = null;
  }

  public saveBroker(): void {
    const broker: LoginBroker = new LoginBroker();
    broker.name = this.nameControl.value;
    broker.url = this.urlControl.value;
    broker.dev = this.devControl.value;

    if (this.editingIndex != null && this.editingIndex >= 0) {
      this.loginService.updateBroker(this.editingIndex, broker);
    } else {
      this.loginService.addBroker(broker);
    }

    this.addForm.reset();
    this.exitEditor();
  }

  public deleteBroker(index: number, broker: LoginBroker): void {
    if (broker.name !== this.activeBrokerName) {
      this.loginService.deleteBroker(index);
    }
  }

  public loadBroker(event: any, broker: LoginBroker): void {
    if (broker.name === this.activeBrokerName && event.target && DomUtil.isInClass(event.target, 'broker-actions')) {
      return;
    }

    this.brokerService.login(broker);
  }

  private createBrokerValidator(ls: LoginService): any {
    return (c: FormControl) => {
      return new Observable<any>(
        observer => {
          ls.getBrokers().subscribe(brokers => {
            if (brokers && brokers.length && brokers.find(b => String.equals(b.name, c.value, true))) {
              observer.next({ broker: true });
            } else {
              observer.next(null);
            }
            observer.complete();
          });
        });
    };
  }
}

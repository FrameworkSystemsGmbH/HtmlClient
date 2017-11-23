import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { IAppState } from 'app/app.reducers';

import { LoginBroker } from 'app/common/login-broker';
import { LoginService } from 'app/services/login.service';
import { BrokerService } from 'app/services/broker.service';

@Component({
  selector: 'hc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public brokers$: Observable<Array<LoginBroker>>;
  public activeBrokerName$: Observable<string>;
  public addForm: FormGroup;
  public nameControl: FormControl;
  public urlControl: FormControl;

  constructor(
    private loginService: LoginService,
    private brokerService: BrokerService,
    private store: Store<IAppState>) { }

  public ngOnInit(): void {
    this.brokers$ = this.loginService.getBrokers();
    this.activeBrokerName$ = this.store.select(appState => appState.broker.activeBrokerName);

    this.nameControl = new FormControl(null, Validators.required, this.createBrokerValidator(this.loginService));
    this.urlControl = new FormControl(null, Validators.required);

    this.addForm = new FormGroup({
      name: this.nameControl,
      url: this.urlControl
    });
  }

  public nameHasErrors(): boolean {
    return !this.nameControl.valid && !this.nameControl.pristine;
  }

  public urlHasErrors(): boolean {
    return !this.urlControl.valid && !this.urlControl.pristine;
  }

  public addBroker(): void {
    const newBroker: LoginBroker = new LoginBroker();
    newBroker.name = this.nameControl.value;
    newBroker.url = this.urlControl.value;

    this.loginService.addBroker(newBroker);
    this.addForm.reset();
  }

  public deleteBroker(index: number): void {
    this.loginService.deleteBroker(index);
  }

  public loadBroker(broker: LoginBroker): void {
    this.brokerService.login(broker);
  }

  private createBrokerValidator(bs: LoginService): any {
    return (c: FormControl) => {
      return new Observable<any>(
        observer => {
          bs.getBrokers().subscribe(brokers => {
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

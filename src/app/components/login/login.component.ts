import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ISubscription } from 'rxjs/Subscription';

import { LoginBroker } from '../../common';
import { LoginService } from '../../services/login.service';
import { BrokerService } from '../../services/broker.service';

@Component({
  selector: 'hc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {

  public brokers: Array<LoginBroker>;
  public activeBroker: LoginBroker;
  public addForm: FormGroup;
  public nameControl: FormControl;
  public urlControl: FormControl;

  private brokersSub: ISubscription;
  private activeBrokerSub: ISubscription;

  constructor(
    private loginService: LoginService,
    private brokerService: BrokerService) { }

  public ngOnInit(): void {
    this.brokersSub = this.loginService.getBrokers().subscribe(brokers => { this.brokers = brokers; });
    this.activeBrokerSub = this.brokerService.activeBrokerChanged.subscribe(broker => { this.activeBroker = broker });

    this.activeBroker = this.brokerService.getActiveBroker();
    this.nameControl = new FormControl(null, Validators.required, this.createBrokerValidator(this.loginService));
    this.urlControl = new FormControl(null, Validators.required);

    this.addForm = new FormGroup({
      name: this.nameControl,
      url: this.urlControl
    });
  }

  public ngOnDestroy(): void {
    this.brokersSub.unsubscribe();
    this.activeBrokerSub.unsubscribe();
  }

  public nameHasErrors(): boolean {
    return !this.nameControl.valid && !this.nameControl.pristine;
  }

  public urlHasErrors(): boolean {
    return !this.urlControl.valid && !this.urlControl.pristine;
  }

  public addBroker(): void {
    let newBroker: LoginBroker = new LoginBroker();
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
        (observer) => {
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

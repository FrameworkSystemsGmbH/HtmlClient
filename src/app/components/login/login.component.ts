import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { ISubscription } from 'rxjs/Subscription';

import { LoginBroker } from './login-broker';
import { LoginService } from './login.service';

@Component({
  selector: 'hc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {

  public brokers: Array<LoginBroker>;
  public addForm: FormGroup;
  public nameControl: FormControl;
  public urlControl: FormControl;

  private brokersSub: ISubscription;

  constructor(
    private router: Router,
    private brokerService: LoginService) { }

  public ngOnInit(): void {
    this.brokersSub = this.brokerService.getBrokers().subscribe(brokers => {
      this.brokers = brokers;
    });

    this.nameControl = new FormControl(null, Validators.required, this.createBrokerValidator(this.brokerService));
    this.urlControl = new FormControl(null, Validators.required);

    this.addForm = new FormGroup({
      name: this.nameControl,
      url: this.urlControl
    });
  }

  public ngOnDestroy(): void {
    this.brokersSub.unsubscribe();
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

    this.brokerService.addBroker(newBroker);
    this.addForm.reset();
  }

  public deleteBroker(index: number): void {
    this.brokerService.deleteBroker(index);
  }

  public loadBroker(broker: LoginBroker): void {
    this.router.navigate(['/viewer']);
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

import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { ISubscription } from 'rxjs/Subscription';

import { Broker } from './broker';
import { BrokerService } from './broker.service';

@Component({
  selector: 'hc-broker',
  templateUrl: './broker.component.html',
  styleUrls: ['./broker.component.scss'],
})
export class BrokerComponent implements OnInit, OnDestroy {

  public brokers: Array<Broker>;
  public addForm: FormGroup;
  public nameControl: FormControl;
  public urlControl: FormControl;

  private _brokersSub: ISubscription;

  constructor(private _brokerService: BrokerService) { }

  public ngOnInit(): void {
    this._brokersSub = this._brokerService.getBrokers().subscribe(brokers => {
      this.brokers = brokers;
    });

    this.nameControl = new FormControl(null, Validators.required, this.createBrokerValidator(this._brokerService));
    this.urlControl = new FormControl(null, Validators.required);

    this.addForm = new FormGroup({
      name: this.nameControl,
      url: this.urlControl
    });
  }

  public ngOnDestroy(): void {
    this._brokersSub.unsubscribe();
  }

  public nameHasErrors(): boolean {
    return !this.nameControl.valid && !this.nameControl.pristine;
  }

  public urlHasErrors(): boolean {
  return !this.urlControl.valid && !this.urlControl.pristine;
  }

  public addBroker(): void {
    let newBroker: Broker = new Broker();
    newBroker.name = this.nameControl.value;
    newBroker.url = this.urlControl.value;

    this._brokerService.addBroker(newBroker);
    this.addForm.reset();
  }

  public deleteBroker(index: number): void {
    this._brokerService.deleteBroker(index);
  }

  private createBrokerValidator(bs: BrokerService): any {
    return (c: FormControl) => {
      console.log(this.addForm);
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

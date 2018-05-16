import { Location } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ISubscription } from 'rxjs/Subscription';

import { BrokerService } from 'app/services/broker.service';
import { LoginBroker } from 'app/common/login-broker';
import { LoginOptions } from 'app/common/login-options';

@Component({
  selector: 'hc-load',
  templateUrl: './load.component.html',
  styleUrls: ['./load.component.scss']
})
export class LoadComponent implements OnInit, OnDestroy {

  private queryParamsSub: ISubscription;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private brokerService: BrokerService) { }

  public ngOnInit(): void {
    this.queryParamsSub = this.route.queryParams.subscribe(params => {
      const url = window.location.origin + window.location.pathname.trimStringRight('/html/');

      const loginBroker: LoginBroker = new LoginBroker();
      loginBroker.name = 'External';
      loginBroker.dev = params.dev === '1';
      loginBroker.url = url;

      let loginOptions: LoginOptions = null;

      if (params.lang != null) {
        loginOptions = new LoginOptions();
        loginOptions.languages = params.lang;
      }

      this.brokerService.login(loginBroker, true, loginOptions);
    });
  }

  public ngOnDestroy(): void {
    if (this.queryParamsSub) {
      this.queryParamsSub.unsubscribe();
    }
  }
}

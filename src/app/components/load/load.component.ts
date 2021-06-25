import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginBroker } from '@app/common/login-broker';
import { LoginOptions } from '@app/common/login-options';
import { BrokerService } from '@app/services/broker.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hc-load',
  templateUrl: './load.component.html',
  styleUrls: ['./load.component.scss']
})
export class LoadComponent implements OnInit, OnDestroy {

  private queryParamsSub: Subscription;

  public constructor(
    private readonly route: ActivatedRoute,
    private readonly brokerService: BrokerService) { }

  public ngOnInit(): void {
    this.queryParamsSub = this.route.queryParams.subscribe(params => {
      const url = window.location.origin + window.location.pathname.trimStringRight('/html/');

      const loginBroker: LoginBroker = new LoginBroker();
      loginBroker.name = 'External';
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

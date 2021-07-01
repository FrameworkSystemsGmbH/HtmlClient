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

  private _queryParamsSub: Subscription | null = null;

  public constructor(
    private readonly _route: ActivatedRoute,
    private readonly _brokerService: BrokerService) { }

  public ngOnInit(): void {
    this._queryParamsSub = this._route.queryParams.subscribe(params => {
      const url = window.location.origin + window.location.pathname.trimStringRight('/html/');

      const loginBroker: LoginBroker = new LoginBroker('External', url);

      let loginOptions: LoginOptions | undefined;

      if (params.lang != null) {
        loginOptions = new LoginOptions();
        loginOptions.languages = params.lang;
      }

      this._brokerService.login(loginBroker, true, loginOptions);
    });
  }

  public ngOnDestroy(): void {
    if (this._queryParamsSub) {
      this._queryParamsSub.unsubscribe();
    }
  }
}

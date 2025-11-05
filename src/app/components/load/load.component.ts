import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginBroker } from '@app/common/login-broker';
import { LoginOptions } from '@app/common/login-options';
import { BrokerService } from '@app/services/broker.service';
import { Subscription } from 'rxjs';

/**
 * Für StartPage-Aufruf mit direkter Broker-Url. Umgeht Broker-Anmeldung(Login)
 */
@Component({
  standalone: true,
  selector: 'hc-load',
  templateUrl: './load.component.html',
  styleUrls: ['./load.component.scss']
})
export class LoadComponent implements OnInit, OnDestroy {

  private readonly _route = inject(ActivatedRoute);
  private readonly _brokerService = inject(BrokerService);

  private _queryParamsSub: Subscription | null = null;

  public ngOnInit(): void {
    this._queryParamsSub = this._route.queryParams.subscribe({
      next: params => {
        const url = window.location.origin + window.location.pathname.trimStringRight('/html/');

        const loginBroker: LoginBroker = new LoginBroker('External', url);

        let loginOptions: LoginOptions | undefined;

        if (params.lang != null) {
          loginOptions = new LoginOptions();
          loginOptions.languages = params.lang;
        }

        this._brokerService.login(loginBroker, true, loginOptions);
      }
    });
  }

  public ngOnDestroy(): void {
    this._queryParamsSub?.unsubscribe();
  }
}

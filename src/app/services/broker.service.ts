import { Injectable, ViewContainerRef } from '@angular/core';
import { ISubscription } from 'rxjs/subscription';

import { ActionsService, EventsService, FormsService, HttpService } from '.';
import { ClientEventArgs } from '../models/eventargs';
import { JsonUtil } from '../util';

@Injectable()
export class BrokerService {

  private onEventFiredSub: ISubscription;
  private onResponseReceivedSub: ISubscription;

  private appVC: ViewContainerRef;

  constructor(
    private httpService: HttpService,
    private actionsService: ActionsService,
    private eventsService: EventsService,
    private formsService: FormsService
  ) {
    this.onEventFiredSub = this.eventsService.onEventFired.subscribe((eventArgs: ClientEventArgs) => {
      this.performRequest(this.createRequest(eventArgs));
    });

    this.onResponseReceivedSub = this.httpService.onResponseReceived.subscribe((responseJson: any) => {
      this.processResponse(responseJson);
    });
  }

  public sendInitRequest(appVC: ViewContainerRef): void {
    this.appVC = appVC;

    let requestJson: any = {
      init: true
    };

    this.httpService.doRequest(requestJson);
  }

  private createRequest(eventArgs?: ClientEventArgs): any {
    let formsJson: any = this.formsService.getFormsJson(eventArgs);

    if (!JsonUtil.isEmptyObject(formsJson)) {

      let requestJson: any = {
        forms: formsJson
      };

      return requestJson;
    }

    return null;
  }

  public performRequest(requestJson: any): void {
    this.httpService.doRequest(requestJson);
  }

  public processResponse(responseJson: any) {
    if (responseJson.forms && responseJson.forms.length) {
      this.formsService.setFormsJson(this.appVC, responseJson.forms);
    }

    if (responseJson.actions && responseJson.actions.length) {
      this.actionsService.processActions(responseJson.actions);
    }
  }
}

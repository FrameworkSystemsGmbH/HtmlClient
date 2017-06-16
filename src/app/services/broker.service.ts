import { Injectable, ViewContainerRef, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ISubscription } from 'rxjs/subscription';

import { ClientEventArgs } from '../common/eventargs';
import { JsonUtil } from '../util';
import { ResponseDto } from '../communication/response';
import { HttpService } from './http.service';
import { ActionsService } from './actions.service';
import { ControlStyleService } from './control-style.service';
import { EventsService } from './events.service';
import { FormsService } from './forms.service';
import { ErrorService } from './error.service';
import { RoutingService } from './routing.service';
import { LoginBroker } from '../common';

@Injectable()
export class BrokerService {

  public activeBrokerChanged: EventEmitter<LoginBroker>;

  private activeBroker: LoginBroker;
  private onEventFiredSub: ISubscription;
  private onResponseReceivedSub: ISubscription;

  constructor(
    private httpService: HttpService,
    private actionsService: ActionsService,
    private controlStyleSerivce: ControlStyleService,
    private eventsService: EventsService,
    private formsService: FormsService,
    private errorService: ErrorService,
    private routingService: RoutingService
  ) {
    // this.onEventFiredSub = this.eventsService.onEventFired.subscribe((eventArgs: ClientEventArgs) => {
    //   this.performRequest(this.createRequest(eventArgs));
    // });

    this.onResponseReceivedSub = this.httpService.onResponseReceived.subscribe((responseJson: any) => {
      this.processResponse(responseJson);
    });

    this.activeBrokerChanged = new EventEmitter<LoginBroker>();
  }

  public getActiveBroker(): LoginBroker {
    return this.activeBroker;
  }

  public login(broker: LoginBroker): void {
    if (this.activeBroker === broker) {
      this.routingService.showViewer();
    } else {
      if (this.activeBroker) {
        this.formsService.resetViews();
      }
      this.activeBroker = broker;
      this.activeBrokerChanged.emit(broker);
      this.sendInitRequest();
    }
  }

  public sendInitRequest(): void {
    let requestJson: any = {
      init: true
    };

    this.httpService.doRequest(requestJson);
  }

  // private createRequest(eventArgs?: ClientEventArgs): any {
  //   let formsJson: any = this.formsService.getFormsJson(eventArgs);

  //   if (!JsonUtil.isEmptyObject(formsJson)) {

  //     let requestJson: any = {
  //       forms: formsJson
  //     };

  //     return requestJson;
  //   }

  //   return null;
  // }

  public performRequest(requestJson: any): void {
    this.httpService.doRequest(requestJson);
  }

  public processResponse(responseJson: any) {
    if (!responseJson) {
      throw new Error('Response JSON is null or empty!');
    }

    if (responseJson.controlStyles && responseJson.controlStyles.length) {
      for (let controlStyle of responseJson.controlStyles) {
        this.controlStyleSerivce.addControlStyle(controlStyle.name, controlStyle.properties);
      }
    }

    if (responseJson.forms && responseJson.forms.length) {
      this.formsService.setJson(responseJson.forms);
    }

    if (responseJson.actions && responseJson.actions.length) {
      this.actionsService.processActions(responseJson.actions);
    }

    this.routingService.showViewer();
  }
}

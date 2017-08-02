import { Injectable, ViewContainerRef, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ISubscription } from 'rxjs/subscription';

import { JsonUtil } from '../util';
import { HttpService } from './http.service';
import { ActionsService } from './actions.service';
import { ControlStyleService } from './control-style.service';
import { EventsService } from './events.service';
import { FormsService } from './forms.service';
import { ErrorService } from './error.service';
import { RoutingService } from './routing.service';
import { TitleService } from './title.service';
import { LoginBroker } from '../common';
import { ClientEvent } from '../common/events';
import { RequestType } from '../enums'

@Injectable()
export class BrokerService {

  public activeBrokerChanged: EventEmitter<LoginBroker>;

  private activeToken: string;
  private activeBroker: LoginBroker;
  private requestCounter: number;
  private languages: Array<string>;
  private onEventFiredSub: ISubscription;

  constructor(
    private httpService: HttpService,
    private actionsService: ActionsService,
    private controlStyleSerivce: ControlStyleService,
    private eventsService: EventsService,
    private formsService: FormsService,
    private errorService: ErrorService,
    private routingService: RoutingService,
    private titleService: TitleService
  ) {
    this.resetActiveBroker();
    this.activeBrokerChanged = new EventEmitter<LoginBroker>();

    this.onEventFiredSub = this.eventsService.onEventFired
      .concatMap(event => this.httpService.doRequest(this.createRequest(event)))
      .subscribe(responseJson => this.processResponse(responseJson));
  }

  public getActiveBroker(): LoginBroker {
    return this.activeBroker;
  }

  public login(broker: LoginBroker): void {
    if (this.activeBroker === broker) {
      this.routingService.showViewer();
    } else {
      if (this.activeBroker) {
        this.resetActiveBroker();
      }
      this.httpService.setBrokerUrl(broker.url);
      this.activeBroker = broker;
      this.activeBrokerChanged.emit(broker);
      this.sendInitRequest();
    }
  }

  private resetActiveBroker(): void {
    this.formsService.resetViews();
    this.activeToken = String.empty();
    this.requestCounter = 0;
    this.languages = ['de', 'en'];
  }

  public sendInitRequest(): void {
    let requestJson: any = {
      meta: this.getMetaJson(RequestType.Request)
    };

    this.httpService.doRequest(requestJson).subscribe(responseJson => this.processResponse(responseJson));
  }

  private getMetaJson(requestType: RequestType): any {
    let metaJson: any = {
      token: this.activeToken,
      requCounter: ++this.requestCounter,
      languages: this.languages,
      type: RequestType[requestType]
    };

    return metaJson;
  }

  private createRequest(event: ClientEvent): any {
    let requestJson: any = {
      meta: this.getMetaJson(RequestType.Request),
      event: event
    };

    let formsJson: any = this.formsService.getFormsJson();

    if (!JsonUtil.isEmptyObject(formsJson)) {
      requestJson.forms = formsJson;
    }

    return requestJson;
  }

  public processResponse(json: any) {
    if (!json) {
      throw new Error('Response JSON is null or empty!');
    }

    this.processMeta(json.meta);

    if (json.start && !JsonUtil.isEmptyObject(json.start)) {
      this.processApplication(json.start.application);
      this.processControlStyles(json.start.controlStyles);
    }

    if (json.forms && json.forms.length) {
      this.formsService.setJson(json.forms);
    }

    if (json.actions && json.actions.length) {
      this.actionsService.processActions(json.actions);
    }

    this.routingService.showViewer();
  }

  private processMeta(metaJson: any): void {
    if (!metaJson) {
      throw new Error('Could not find property \'meta\' in response JSON!');
    }

    this.activeToken = metaJson.token;
  }

  private processApplication(applicationJson: any): void {
    if (!applicationJson) {
      throw new Error('Could not find property \'application\' in start JSON!');
    }

    if (applicationJson.title) {
      this.titleService.setTitle(applicationJson.title);
    }
  }

  private processControlStyles(controlStylesJson: any): void {
    if (controlStylesJson && controlStylesJson.length) {
      for (let controlStyleJson of controlStylesJson) {
        this.controlStyleSerivce.addControlStyle(controlStyleJson.name, controlStyleJson.properties);
      }
    }
  }
}

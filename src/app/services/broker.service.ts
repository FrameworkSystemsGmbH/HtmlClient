import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ISubscription } from 'rxjs/subscription';

import { JsonUtil } from '../util';
import { ActionsService } from './actions.service';
import { ControlStyleService } from './control-style.service';
import { EventsService } from './events.service';
import { FormsService } from './forms.service';
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
  private activeBrokerRequestUrl: string;
  private activeBrokerImageUrl: string;
  private activeBrokerFilesUrl: string;
  private requestCounter: number;
  private languages: Array<string>;
  private onEventFiredSub: ISubscription;

  constructor(
    private httpClient: HttpClient,
    private actionsService: ActionsService,
    private controlStyleSerivce: ControlStyleService,
    private eventsService: EventsService,
    private formsService: FormsService,
    private routingService: RoutingService,
    private titleService: TitleService
  ) {
    this.resetActiveBroker();
    this.activeBrokerChanged = new EventEmitter<LoginBroker>();

    this.onEventFiredSub = this.eventsService.onEventFired
      .concatMap(event => this.doRequest(this.createRequest(event)))
      .subscribe(responseJson => this.processResponse(responseJson));
  }

  public getActiveBroker(): LoginBroker {
    return this.activeBroker;
  }

  public getImageUrl(image: string): string {
    if (String.isNullOrWhiteSpace(image)) {
      return null;
    }

    const imgLower: string = image.toLowerCase();

    if (imgLower.startsWith('http://') || imgLower.startsWith('https://')) {
      return image;
    }

    if (!image.startsWith('/')) {
      return this.activeBrokerFilesUrl + '/' + image;
    }

    return null;
  }

  public login(broker: LoginBroker): void {
    if (this.activeBroker === broker) {
      this.routingService.showViewer();
    } else {
      if (this.activeBroker) {
        this.resetActiveBroker();
      }
      const url: string = broker.url
      this.activeBrokerRequestUrl = url.trimCharsRight('/') + '/api/process';
      this.activeBrokerImageUrl = url.trimCharsRight('/') + '/api/image';
      this.activeBrokerFilesUrl = url.trimCharsRight('/') + '/files';
      this.activeBroker = broker;
      this.activeBrokerChanged.emit(broker);
      this.sendInitRequest();
    }
  }

  private resetActiveBroker(): void {
    this.formsService.resetViews();
    this.activeToken = String.empty();
    this.activeBrokerRequestUrl = null;
    this.activeBrokerImageUrl = null;
    this.requestCounter = 0;
    this.languages = ['de', 'en'];
  }

  public sendInitRequest(): void {
    let requestJson: any = {
      meta: this.getMetaJson(RequestType.Request)
    };

    this.doRequest(requestJson).subscribe(responseJson => this.processResponse(responseJson));
  }

  private doRequest(requestJson: any): Observable<any> {
    // console.log(JSON.stringify(requestJson, null, 2));
    return this.httpClient.post(this.activeBrokerRequestUrl, requestJson);
      // .do(response => {
      //   console.log(JSON.stringify(response, null, 2));
      // });
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

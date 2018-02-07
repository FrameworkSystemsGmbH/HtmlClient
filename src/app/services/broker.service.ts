import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import 'rxjs/add/observable/of';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/concatMap';

import { ErrorBoxOverlay } from 'app/components/errorbox/errorbox-overlay';
import { MsgBoxOverlay } from 'app/components/msgbox/msgbox-overlay';
import { ActionsService } from 'app/services/actions.service';
import { ControlStyleService } from 'app/services/control-style.service';
import { EventsService } from 'app/services/events.service';
import { FormsService } from 'app/services/forms.service';
import { RoutingService } from 'app/services/routing.service';
import { TextsService } from 'app/services/texts.service';
import { TitleService } from 'app/services/title.service';
import { LoginBroker } from 'app/common/login-broker';
import { ClientEvent } from 'app/common/events/client-event';
import { RequestType } from 'app/enums/request-type';
import { JsonUtil } from 'app/util/json-util';
import { UrlUtil } from 'app/util/url-util';

import * as fromAppReducers from 'app/app.reducers';
import * as fromBrokerActions from 'app/store/broker.actions';

@Injectable()
export class BrokerService {

  private activeBrokerName: string;
  private activeBrokerToken: string;
  private activeBrokerRequestUrl: string;
  private requestCounter: number;
  private languages: Array<string>;

  constructor(
    private httpClient: HttpClient,
    private errorBoxOverlay: ErrorBoxOverlay,
    private msgBoxOverlay: MsgBoxOverlay,
    private actionsService: ActionsService,
    private controlStyleSerivce: ControlStyleService,
    private eventsService: EventsService,
    private formsService: FormsService,
    private routingService: RoutingService,
    private textsService: TextsService,
    private titleService: TitleService,
    private store: Store<fromAppReducers.IAppState>
  ) {
    this.store.select(appState => appState.broker).subscribe(brokerState => {
      this.activeBrokerName = brokerState.activeBrokerName;
      this.activeBrokerToken = brokerState.activeBrokerToken;
      this.activeBrokerRequestUrl = brokerState.activeBrokerRequestUrl;
    });

    this.eventsService.onHandleEvent
      .concatMap(event => Observable.of(event)
        .mergeMap(() => {
          if (!event.callbacks || event.callbacks.canExecute(event.originalEvent, event.clientEvent)) {
            return this.doRequest(this.createRequest(event.clientEvent))
              .map(responseJson => this.processResponse(responseJson))
              .map(() => true);
          } else {
            return Observable.of(false);
          }
        })
        .map(executed => {
          if (executed && event.callbacks && event.callbacks.onExecuted) {
            event.callbacks.onExecuted(event.originalEvent, event.clientEvent);
          }
          if (event.callbacks && event.callbacks.onCompleted) {
            event.callbacks.onCompleted(event.originalEvent, event.clientEvent);
          }
        })
      ).subscribe();

    this.resetActiveBroker();
  }

  public getActiveBrokerName(): string {
    return this.activeBrokerName;
  }

  public login(broker: LoginBroker): void {
    if (this.activeBrokerName === broker.name) {
      this.routingService.showViewer();
    } else {
      if (this.activeBrokerName) {
        this.resetActiveBroker();
      }
      const name = broker.name;
      const url: string = broker.url;
      const fileUrl: string = url.trimCharsRight('/') + '/files';
      const imageUrl: string = url.trimCharsRight('/') + '/api/image';
      const requestUrl: string = url.trimCharsRight('/') + '/api/process';

      this.store.dispatch(new fromBrokerActions.SetBrokerNameAction(name));
      this.store.dispatch(new fromBrokerActions.SetBrokerUrlAction(url));
      this.store.dispatch(new fromBrokerActions.SetBrokerFilesUrlAction(fileUrl));
      this.store.dispatch(new fromBrokerActions.SetBrokerImageUrlAction(imageUrl));
      this.store.dispatch(new fromBrokerActions.SetBrokerRequestUrlAction(requestUrl));

      this.sendInitRequest();
    }
  }

  private resetActiveBroker(): void {
    this.formsService.resetViews();
    this.store.dispatch(new fromBrokerActions.ResetBrokerAction());
    this.requestCounter = 0;
    this.languages = ['de', 'en'];
  }

  public sendInitRequest(): void {
    const requestJson: any = {
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
    const metaJson: any = {
      token: this.activeBrokerToken,
      requCounter: ++this.requestCounter,
      languages: this.languages,
      type: RequestType[requestType]
    };

    return metaJson;
  }

  private createRequest(event: ClientEvent): any {
    const requestJson: any = {
      meta: this.getMetaJson(RequestType.Request),
      event
    };

    const formsJson: any = this.formsService.getFormsJson();

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
      this.processTexts(json.start.texts);
    }

    if (json.forms && json.forms.length) {
      this.formsService.setJson(json.forms);
    }

    if (json.actions && json.actions.length) {
      this.actionsService.processActions(json.actions);
    }

    if (json.error) {
      this.errorBoxOverlay.openErrorBox({
        errorMessage: {
          message: UrlUtil.urlDecode(json.error.message),
          stackTrace: UrlUtil.urlDecode(json.error.stackTrace)
        }
      });
    } else if (json.msgBoxes) {
      const msgBoxJson: any = json.msgBoxes[0];
      this.msgBoxOverlay.openMsgBox({
        msgBoxMessage: {
          formId: msgBoxJson.formId,
          id: msgBoxJson.id,
          message: UrlUtil.urlDecode(msgBoxJson.message),
          icon: msgBoxJson.icon,
          buttons: msgBoxJson.buttons
        }
      });
    }

    this.routingService.showViewer();
  }

  private processMeta(metaJson: any): void {
    if (!metaJson) {
      throw new Error('Could not find property \'meta\' in response JSON!');
    }

    this.store.dispatch(new fromBrokerActions.SetBrokerTokenAction(metaJson.token));
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
      for (const controlStyleJson of controlStylesJson) {
        this.controlStyleSerivce.addControlStyle(controlStyleJson.name, controlStyleJson.properties);
      }
    }
  }

  private processTexts(textsJson: any): void {
    if (textsJson && textsJson.length) {
      for (const textJson of textsJson) {
        this.textsService.setText(textJson.id, textJson.value);
      }
    }
  }
}

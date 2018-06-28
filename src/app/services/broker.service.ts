import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, of as obsOf, forkJoin } from 'rxjs';
import { concatMap, flatMap, map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { ActionsService } from 'app/services/actions.service';
import { ClientDataService } from 'app/services/client-data.service';
import { ControlStyleService } from 'app/services/control-style.service';
import { DialogService } from 'app/services/dialog.service';
import { EventsService } from 'app/services/events.service';
import { FormsService } from 'app/services/forms.service';
import { FramesService } from 'app/services/frames.service';
import { LocaleService } from './locale.service';
import { RoutingService } from 'app/services/routing.service';
import { TextsService } from 'app/services/texts.service';
import { TitleService } from 'app/services/title.service';
import { LoginBroker } from 'app/common/login-broker';
import { LoginOptions } from 'app/common/login-options';
import { InternalEvent } from '../common/events/internal/internal-event';
import { ClientEvent } from 'app/common/events/client-event';
import { ClientMsgBoxEvent } from '../common/events/client-msgbox-event';
import { RequestType } from 'app/enums/request-type';
import { JsonUtil } from 'app/util/json-util';
import { RxJsUtil } from 'app/util/rxjs-util';
import { UrlUtil } from 'app/util/url-util';

import * as fromAppReducers from 'app/app.reducers';
import * as fromBrokerActions from 'app/store/broker.actions';

import * as Moment from 'moment-timezone';

@Injectable()
export class BrokerService {

  private static readonly SESSION_DATA_DISCARD: string = 'DISCARD';

  private _onLoginComplete: Subject<any>;
  private _onLoginComplete$: Observable<any>;

  private activeBrokerName: string;
  private activeBrokerToken: string;
  private activeBrokerRequestUrl: string;
  private requestCounter: number;
  private clientLanguages: string;
  private lastRequestTime: Moment.Moment;

  constructor(
    private httpClient: HttpClient,
    private actionsService: ActionsService,
    private clientDataService: ClientDataService,
    private controlStyleSerivce: ControlStyleService,
    private dialogService: DialogService,
    private eventsService: EventsService,
    private formsService: FormsService,
    private framesService: FramesService,
    private localeService: LocaleService,
    private routingService: RoutingService,
    private textsService: TextsService,
    private titleService: TitleService,
    private store: Store<fromAppReducers.IAppState>
  ) {
    this._onLoginComplete = new Subject<any>();
    this._onLoginComplete$ = this._onLoginComplete.asObservable();

    this.store.select(appState => appState.broker).subscribe(brokerState => {
      this.activeBrokerName = brokerState.activeBrokerName;
      this.activeBrokerToken = brokerState.activeBrokerToken;
      this.activeBrokerRequestUrl = brokerState.activeBrokerRequestUrl;
    });

    this.eventsService.eventFired.pipe(
      concatMap(event => this.handleEvent(event))
    ).subscribe();

    this.resetActiveBroker();
  }

  private handleEvent(event: InternalEvent<ClientEvent>): Observable<void> {
    return obsOf(event).pipe(
      flatMap(() => {
        if (!event.callbacks || event.callbacks.canExecute(event.originalEvent, event.clientEvent)) {
          return this.createRequest(event.clientEvent).pipe(
            flatMap(requestJson => this.doRequest(requestJson)),
            flatMap(responseJson => this.processResponse(responseJson))
          );
        } else {
          return obsOf(false);
        }
      }),
      map(executed => {
        if (executed && event.callbacks && event.callbacks.onExecuted) {
          event.callbacks.onExecuted(event.originalEvent, event.clientEvent);
        }
        if (event.callbacks && event.callbacks.onCompleted) {
          event.callbacks.onCompleted(event.originalEvent, event.clientEvent);
        }
      })
    );
  }

  public get onLoginComplete() {
    return this._onLoginComplete$;
  }

  public getActiveBrokerName(): string {
    return this.activeBrokerName;
  }

  public login(broker: LoginBroker, direct: boolean, options?: LoginOptions): void {
    if (this.activeBrokerName === broker.name) {
      this.routingService.showViewer();
    } else {
      if (this.activeBrokerName) {
        this.resetActiveBroker();
      }

      const name = broker.name;
      const url: string = broker.url;
      const fileUrl: string = url.trimCharsRight('/') + '/';
      const imageUrl: string = url.trimCharsRight('/') + '/api/image';
      const requestUrl: string = url.trimCharsRight('/') + '/api/process';

      if (options != null && !String.isNullOrWhiteSpace(options.languages)) {
        this.clientLanguages = options.languages;
      }

      this.store.dispatch(new fromBrokerActions.SetBrokerNameAction(name));
      this.store.dispatch(new fromBrokerActions.SetBrokerUrlAction(url));
      this.store.dispatch(new fromBrokerActions.SetBrokerDirectAction(direct));
      this.store.dispatch(new fromBrokerActions.SetBrokerFilesUrlAction(fileUrl));
      this.store.dispatch(new fromBrokerActions.SetBrokerImageUrlAction(imageUrl));
      this.store.dispatch(new fromBrokerActions.SetBrokerRequestUrlAction(requestUrl));

      const onError: (error: any) => void = error => {
        this.resetActiveBroker();
        throw error;
      };

      const onComplete: () => void = () => {
        this._onLoginComplete.next();
      };

      this.sendInitRequest().pipe(
        flatMap(responseJson => this.processResponse(responseJson))
      ).subscribe(null, onError, onComplete);
    }
  }

  private resetActiveBroker(): void {
    this.formsService.resetViews();
    this.store.dispatch(new fromBrokerActions.ResetBrokerAction());
    this.requestCounter = 0;
    this.clientLanguages = this.localeService.getLocale().substring(0, 2);
    this.lastRequestTime = null;
  }

  public sendInitRequest(): Observable<any> {
    return this.getMetaJson(true).pipe(
      map(metaJson => {
        return {
          meta: metaJson
        };
      }),
      flatMap(requestJson => this.doRequest(requestJson))
    );
  }

  private doRequest(requestJson: any): Observable<any> {
    this.lastRequestTime = Moment.utc();
    // console.log(JSON.stringify(requestJson, null, 2));
    return this.httpClient.post(this.activeBrokerRequestUrl, requestJson);
    // .do(response => {
    //   console.log(JSON.stringify(response, null, 2));
    // });
  }

  private getMetaJson(initRequest: boolean): Observable<any> {
    const metaJson: any = {
      token: this.activeBrokerToken,
      requCounter: ++this.requestCounter,
      languages: [this.clientLanguages],
      type: RequestType.Request
    };

    if (initRequest) {
      return forkJoin(
        this.clientDataService.loadSessionData(),
        this.clientDataService.getDeviceUuid()).pipe(
          map(res => {
            const sessionData: string = res[0];
            const clientId: string = res[1];

            if (!String.isNullOrWhiteSpace(sessionData)) {
              metaJson.sessionData = sessionData;
            }

            if (!String.isNullOrWhiteSpace(clientId)) {
              metaJson.clientInfos = { clientId };
            }

            return metaJson;
          })
        );
    } else {
      return obsOf(metaJson);
    }
  }

  private createRequest(event: ClientEvent): Observable<any> {
    return this.getMetaJson(false).pipe(
      map(metaJson => {
        const requestJson: any = {
          meta: metaJson,
          event
        };

        const formsJson: any = this.formsService.getFormsJson();

        if (!JsonUtil.isEmptyObject(formsJson)) {
          requestJson.forms = formsJson;
        }

        return requestJson;
      })
    );
  }

  public processResponse(json: any): Observable<void> {
    if (!json || JsonUtil.isEmptyObject(json)) {
      throw new Error('Response JSON is null or empty!');
    }

    return RxJsUtil.voidObs().pipe(
      flatMap(() => this.processMeta(json.meta)),
      flatMap(() => this.processStart(json.start)),
      flatMap(() => this.processForms(json.forms)),
      flatMap(() => this.processActions(json.actions)),
      flatMap(() => this.processError(json.error)),
      flatMap(() => this.processMsgBox(json.msgBoxes)),
      flatMap(() => this.processClose(json.meta)),
      map(close => {
        if (close) {
          this.closeApplication();
        } else {
          this.onAfterResponse();
        }
      })
    );
  }

  private processMeta(metaJson: any): Observable<void> {
    if (!metaJson) {
      throw new Error('Could not find property \'meta\' in response JSON!');
    }

    this.store.dispatch(new fromBrokerActions.SetBrokerTokenAction(metaJson.token));

    const sessionData: string = metaJson.sessionData;

    if (!String.isNullOrWhiteSpace(sessionData)) {
      if (sessionData === BrokerService.SESSION_DATA_DISCARD) {
        return this.clientDataService.deleteSessionData().pipe(
          flatMap(() => RxJsUtil.voidObs())
        );
      } else {
        return this.clientDataService.saveSessionData(sessionData).pipe(
          flatMap(() => RxJsUtil.voidObs())
        );
      }
    } else {
      return RxJsUtil.voidObs();
    }
  }

  private processStart(startJson: any): Observable<void> {
    if (startJson && !JsonUtil.isEmptyObject(startJson)) {
      return RxJsUtil.voidObs().pipe(
        flatMap(() => this.processApplication(startJson.application)),
        flatMap(() => this.processControlStyles(startJson.controlStyles)),
        flatMap(() => this.processTexts(startJson.texts))
      );
    } else {
      return RxJsUtil.voidObs();
    }
  }

  private processApplication(applicationJson: any): Observable<void> {
    if (applicationJson && !String.isNullOrWhiteSpace(applicationJson.title)) {
      return RxJsUtil.voidObs().pipe(
        tap(() => this.titleService.setTitle(applicationJson.title))
      );
    } else {
      return RxJsUtil.voidObs();
    }
  }

  private processControlStyles(controlStylesJson: any): Observable<void> {
    if (controlStylesJson && controlStylesJson.length) {
      return RxJsUtil.voidObs().pipe(
        tap(() => {
          for (const controlStyleJson of controlStylesJson) {
            this.controlStyleSerivce.addControlStyle(controlStyleJson.name, controlStyleJson.properties);
          }
        })
      );
    } else {
      return RxJsUtil.voidObs();
    }
  }

  private processTexts(textsJson: any): Observable<void> {
    if (textsJson && textsJson.length) {
      return RxJsUtil.voidObs().pipe(
        tap(() => {
          for (const textJson of textsJson) {
            this.textsService.setText(textJson.id, textJson.value);
          }
        })
      );
    } else {
      return RxJsUtil.voidObs();
    }
  }

  private processForms(formsJson: any): Observable<void> {
    if (formsJson && formsJson.length) {
      return RxJsUtil.voidObs().pipe(
        tap(() => this.formsService.setJson(formsJson))
      );
    } else {
      return RxJsUtil.voidObs();
    }
  }

  private processActions(actionsJson: any): Observable<void> {
    if (actionsJson && actionsJson.length) {
      return RxJsUtil.voidObs().pipe(
        tap(() => this.actionsService.processActions(actionsJson))
      );
    } else {
      return RxJsUtil.voidObs();
    }
  }

  private processError(errorJson: any): Observable<void> {
    if (errorJson && !JsonUtil.isEmptyObject(errorJson)) {
      return this.dialogService.showErrorBox({
        title: this.titleService.getTitle(),
        message: UrlUtil.urlDecode(errorJson.message),
        stackTrace: UrlUtil.urlDecode(errorJson.stackTrace)
      });
    } else {
      return RxJsUtil.voidObs();
    }
  }

  private processMsgBox(msgBoxesJson: any): Observable<void> {
    if (msgBoxesJson && msgBoxesJson.length) {
      const msgBoxJson: any = msgBoxesJson[0];
      const formId: string = msgBoxJson.formId;
      const id: string = msgBoxJson.id;

      return this.dialogService.showMsgBoxBox({
        title: this.titleService.getTitle(),
        message: UrlUtil.urlDecode(msgBoxJson.message),
        icon: msgBoxJson.icon,
        buttons: msgBoxJson.buttons
      }).pipe(
        flatMap(result => this.handleEvent({
          originalEvent: null,
          clientEvent: new ClientMsgBoxEvent(formId, id, result)
        }))
      );
    } else {
      return RxJsUtil.voidObs();
    }
  }

  private processClose(metaJson: any): Observable<boolean> {
    if (metaJson && metaJson.closeApplication === true) {
      return obsOf(true);
    } else {
      return obsOf(false);
    }
  }

  private closeApplication(): void {
    this.resetActiveBroker();
    this.routingService.showLogin();
  }

  private onAfterResponse(): void {
    this.formsService.updateAllComponents();
    this.framesService.layout();
    this.routingService.showViewer();
  }

  public getLastRequestTime(): Moment.Moment {
    return this.lastRequestTime;
  }

  public getState(): any {
    return {
      requestCounter: this.requestCounter,
      clientLanguages: this.clientLanguages,
      lastRequestTime: this.lastRequestTime.toJSON()
    };
  }
  public setState(json: any): void {
    if (!json) {
      return;
    }

    this.requestCounter = json.requestCounter;
    this.clientLanguages = json.clientLanguages;
    this.lastRequestTime = Moment.utc(json.lastRequestTime);
  }
}

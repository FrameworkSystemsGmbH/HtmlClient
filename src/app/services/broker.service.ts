import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, of as obsOf, forkJoin, Subscription } from 'rxjs';
import { concatMap, mergeMap, map, retryWhen, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { RetryBoxResult } from '@app/enums/retrybox-result';
import { ActionsService } from '@app/services/actions.service';
import { BackService } from '@app/services/back-service';
import { ClientDataService } from '@app/services/client-data.service';
import { ControlStyleService } from '@app/services/control-style.service';
import { DialogService } from '@app/services/dialog.service';
import { EventsService } from '@app/services/events.service';
import { FormsService } from '@app/services/forms.service';
import { FramesService } from '@app/services/frames.service';
import { LoaderService } from '@app/services/loader.service';
import { LocaleService } from '@app/services/locale.service';
import { PlatformService } from '@app/services/platform.service';
import { RoutingService } from '@app/services/routing.service';
import { TextsService } from '@app/services/texts.service';
import { TitleService } from '@app/services/title.service';
import { LoginBroker } from '@app/common/login-broker';
import { LoginOptions } from '@app/common/login-options';
import { InternalEvent } from '@app/common/events/internal/internal-event';
import { ClientEvent } from '@app/common/events/client-event';
import { ClientMsgBoxEvent } from '@app/common/events/client-msgbox-event';
import { BackButtonPriority } from '@app/enums/backbutton-priority';
import { MsgBoxIcon } from '@app/enums/msgbox-icon';
import { MsgBoxButtons } from '@app/enums/msgbox-buttons';
import { MsgBoxResult } from '@app/enums/msgbox-result';
import { RequestType } from '@app/enums/request-type';
import { ResponseResult } from '@app/enums/response-result';

import { IBrokerState } from '@app/store/broker/broker.state';
import { selectBrokerState } from '@app/store/broker/broker.selectors';
import { setBrokerState, resetBrokerState } from '@app/store/broker/broker.actions';

import * as Moment from 'moment-timezone';
import * as JsonUtil from '@app/util/json-util';
import * as RxJsUtil from '@app/util/rxjs-util';

@Injectable()
export class BrokerService {

  private static readonly SESSION_DATA_DISCARD: string = 'DISCARD';

  private _onLoginComplete: Subject<any>;
  private _onLoginComplete$: Observable<any>;

  private storeSub: Subscription;
  private eventFiredSub: Subscription;
  private onBackButtonListener: () => boolean;

  private activeLoginBroker: LoginBroker;
  private activeLoginOptions: LoginOptions;
  private activeBrokerDirect: boolean;
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
    private backService: BackService,
    private dialogService: DialogService,
    private eventsService: EventsService,
    private formsService: FormsService,
    private framesService: FramesService,
    private loaderService: LoaderService,
    private localeService: LocaleService,
    private platformService: PlatformService,
    private routingService: RoutingService,
    private textsService: TextsService,
    private titleService: TitleService,
    private store: Store
  ) {
    this._onLoginComplete = new Subject<any>();
    this._onLoginComplete$ = this._onLoginComplete.asObservable();

    this.resetActiveBroker();
  }

  private subscribeToStore(): Subscription {
    return this.store.select(selectBrokerState).subscribe((brokerState: IBrokerState) => {
      this.activeBrokerName = brokerState.activeBrokerName;
      this.activeBrokerToken = brokerState.activeBrokerToken;
      this.activeBrokerRequestUrl = brokerState.activeBrokerRequestUrl;
    });
  }

  private subscribeToEventFired(): Subscription {
    return this.eventsService.eventFired.pipe(
      concatMap(event => this.handleEvent(event))
    ).subscribe();
  }

  private handleEvent(event: InternalEvent<ClientEvent>): Observable<void> {
    return obsOf(event).pipe(
      tap(() => this.loaderService.fireLoadingChanged(true)),
      mergeMap(() => {
        if (!event.callbacks || event.callbacks.canExecute(event.clientEvent, event.payload)) {
          return this.createRequest(event.clientEvent).pipe(
            mergeMap(requestJson => this.doRequest(requestJson)),
            mergeMap(responseJson => this.processResponse(responseJson))
          );
        } else {
          return obsOf({ result: ResponseResult.NotExecuted, processedEvent: null });
        }
      }),
      tap(handleResult => {
        if (handleResult.result === ResponseResult.Executed && event.callbacks && event.callbacks.onExecuted) {
          event.callbacks.onExecuted(event.clientEvent, event.payload, handleResult.processedEvent);
        }
        if (event.callbacks && event.callbacks.onCompleted) {
          event.callbacks.onCompleted(event.clientEvent, event.payload, handleResult.processedEvent);
        }
      }),
      map(handleResult => {
        const result: ResponseResult = handleResult.result;

        this.loaderService.fireLoadingChanged(false);

        if (result === ResponseResult.CloseApplication) {
          this.closeApplication();
        } else if (result === ResponseResult.RestartApplication) {
          this.restartApplication();
        }
      })
    );
  }

  public get onLoginComplete(): Observable<any> {
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

      this.activeLoginBroker = broker;
      this.activeLoginOptions = options;
      this.activeBrokerDirect = direct;

      const name = broker.name;
      const url: string = broker.url;
      const fileUrl: string = url.trimCharsRight('/') + '/';
      const imageUrl: string = url.trimCharsRight('/') + '/api/image';
      const reportUrl: string = url.trimCharsRight('/') + '/api/report';
      const requestUrl: string = url.trimCharsRight('/') + '/api/process';

      if (options != null && !String.isNullOrWhiteSpace(options.languages)) {
        this.clientLanguages = options.languages;
      }

      this.store.dispatch(setBrokerState({
        state: {
          activeBrokerDirect: direct,
          activeBrokerFilesUrl: fileUrl,
          activeBrokerImageUrl: imageUrl,
          activeBrokerName: name,
          activeBrokerReportUrl: reportUrl,
          activeBrokerRequestUrl: requestUrl,
          activeBrokerUrl: url
        }
      }));

      const onError: (error: any) => void = error => {
        this.resetActiveBroker();
        throw error;
      };

      const onComplete: () => void = () => {
        this._onLoginComplete.next();
      };

      this.sendInitRequest().pipe(
        mergeMap(responseJson => this.processResponse(responseJson))
      ).subscribe({
        error: onError,
        complete: onComplete
      });
    }
  }

  private resetActiveBroker(): void {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }

    if (this.eventFiredSub) {
      this.eventFiredSub.unsubscribe();
    }

    if (this.onBackButtonListener) {
      this.backService.removeBackButtonListener(this.onBackButtonListener);
    }

    this.formsService.resetViews();
    this.store.dispatch(resetBrokerState());
    this.requestCounter = 0;
    this.clientLanguages = this.localeService.getLocale().substring(0, 2);
    this.lastRequestTime = null;
    this.activeLoginBroker = null;
    this.activeLoginOptions = null;
    this.activeBrokerDirect = null;

    this.storeSub = this.subscribeToStore();
    this.eventFiredSub = this.subscribeToEventFired();

    this.onBackButtonListener = this.onBackButton.bind(this);
    this.backService.addBackButtonListener(this.onBackButtonListener, BackButtonPriority.ActiveBroker);
  }

  private onBackButton(): boolean {
    if (this.activeBrokerName != null) {
      this.eventsService.fireApplicationQuitRequest();
      return true;
    }

    return false;
  }

  public sendInitRequest(): Observable<any> {
    return this.getMetaJson(true).pipe(
      map(metaJson => {
        return {
          meta: metaJson
        };
      }),
      mergeMap(requestJson => this.doRequest(requestJson))
    );
  }

  private doRequest(requestJson: any): Observable<any> {
    this.lastRequestTime = Moment.utc();
    return this.httpClient.post(this.activeBrokerRequestUrl, requestJson).pipe(
      retryWhen(attempts => attempts.pipe(
        tap(() => this.loaderService.fireLoadingChanged(false)),
        mergeMap(error => {
          return this.createRequestRetryBox(error);
        }),
        tap(() => this.loaderService.fireLoadingChanged(true))
      ))
    );
  }

  private createRequestRetryBox(error: any): Observable<void> {
    return new Observable<void>(subscriber => {
      try {
        const title: string = this.titleService.getTitle();
        const message: string = error && error.status === 0 ? 'Request could not be sent because of a network error!' : error.message;
        const stackTrace = error && error.stack ? error.stack : null;

        this.dialogService.showRetryBoxBox({
          title,
          message,
          stackTrace
        }).subscribe(result => {
          if (result === RetryBoxResult.Retry) {
            subscriber.next(null);
          } else {
            this.closeApplication();
          }
        },
          err => subscriber.error(err),
          () => subscriber.complete());
      } catch (err) {
        subscriber.error(err);
      }
    });
  }

  private getMetaJson(initRequest: boolean): Observable<any> {
    const metaJson: any = {
      token: this.activeBrokerToken,
      requCounter: ++this.requestCounter,
      languages: [this.clientLanguages],
      type: RequestType.Request
    };

    if (initRequest) {
      return forkJoin([
        this.clientDataService.loadSessionData(),
        this.clientDataService.getDeviceUuid()
      ]).pipe(
        map(res => {
          const sessionData: string = res[0];
          const clientId: string = res[1];

          const platform: string = this.platformService.isNative() ? 'Mobile' : 'Web';
          const os: string = this.platformService.getOS();
          const osversion: string = this.platformService.getOSVersion();

          if (!String.isNullOrWhiteSpace(sessionData)) {
            metaJson.sessionData = sessionData;
          }

          let clientInfos: any = {
            Platform: platform,
            OS: os,
            OSVersion: osversion
          };

          if (!String.isNullOrWhiteSpace(clientId)) {
            clientInfos = {
              ...clientInfos,
              ClientID: clientId
            };
          }

          metaJson.clientInfos = clientInfos;

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

  public processResponse(json: any): Observable<{ result: ResponseResult; processedEvent?: any }> {
    if (!json || JsonUtil.isEmptyObject(json)) {
      throw new Error('Response JSON is null or empty!');
    }

    if (!json.meta) {
      throw new Error('Could not find property \'meta\' in response JSON!');
    }

    const metaJson: any = json.meta;

    const responseObs: Observable<void> = RxJsUtil.voidObs().pipe(
      mergeMap(() => this.processMeta(metaJson)),
      mergeMap(() => this.processStart(json.start)),
      mergeMap(() => this.processForms(json.forms)),
      mergeMap(() => this.processActions(json.actions)),
      mergeMap(() => this.processError(json.error)),
      mergeMap(() => this.processMsgBox(json.msgBoxes)));

    if (metaJson.applicationQuitMessages === true) {
      return responseObs.pipe(
        mergeMap(() => this.processQuitMsg(metaJson.restartRequested, json.quitMessages)),
        mergeMap(() => this.onAfterResponse()),
        map(() => ({ result: ResponseResult.Executed }))
      );
    } else if (metaJson.restartApplication === true) {
      return responseObs.pipe(
        map(() => ({ result: ResponseResult.RestartApplication }))
      );
    } else if (metaJson.closeApplication === true) {
      return responseObs.pipe(
        map(() => ({ result: ResponseResult.CloseApplication }))
      );
    } else {
      return responseObs.pipe(
        mergeMap(() => this.onAfterResponse()),
        map(() => ({ result: ResponseResult.Executed, processedEvent: json.processedEvent }))
      );
    }
  }

  private processMeta(metaJson: any): Observable<void> {
    if (!metaJson) {
      throw new Error('Could not find property \'meta\' in response JSON!');
    }

    if (metaJson.restartApplication !== true) {
      this.store.dispatch(setBrokerState({
        state: {
          activeBrokerToken: metaJson.token
        }
      }));
    }

    const sessionData: string = metaJson.sessionData;

    if (!String.isNullOrWhiteSpace(sessionData)) {
      if (sessionData === BrokerService.SESSION_DATA_DISCARD) {
        return this.clientDataService.deleteSessionData().pipe(
          mergeMap(() => RxJsUtil.voidObs())
        );
      } else {
        return this.clientDataService.saveSessionData(sessionData).pipe(
          mergeMap(() => RxJsUtil.voidObs())
        );
      }
    } else {
      return RxJsUtil.voidObs();
    }
  }

  private processStart(startJson: any): Observable<void> {
    if (startJson && !JsonUtil.isEmptyObject(startJson)) {
      return RxJsUtil.voidObs().pipe(
        mergeMap(() => this.processApplication(startJson.application)),
        mergeMap(() => this.processControlStyles(startJson.controlStyles)),
        mergeMap(() => this.processTexts(startJson.texts))
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
      return RxJsUtil.voidObs().pipe(
        tap(() => this.loaderService.fireLoadingChanged(false)),
        mergeMap(() => this.dialogService.showErrorBox({
          title: this.titleService.getTitle(),
          message: errorJson.message,
          stackTrace: errorJson.stackTrace
        })),
        tap(() => this.loaderService.fireLoadingChanged(true))
      );
    } else {
      return RxJsUtil.voidObs();
    }
  }

  private processMsgBox(msgBoxesJson: any): Observable<void> {
    if (msgBoxesJson && msgBoxesJson.length) {
      const msgBoxJson: any = msgBoxesJson[0];
      const formId: string = msgBoxJson.formId;
      const id: string = msgBoxJson.id;

      return RxJsUtil.voidObs().pipe(
        tap(() => this.loaderService.fireLoadingChanged(false)),
        mergeMap(() => this.dialogService.showMsgBoxBox({
          title: this.titleService.getTitle(),
          message: msgBoxJson.message,
          icon: msgBoxJson.icon,
          buttons: msgBoxJson.buttons
        }).pipe(
          mergeMap(result => this.handleEvent({
            clientEvent: new ClientMsgBoxEvent(formId, id, result)
          }))
        )),
        tap(() => this.loaderService.fireLoadingChanged(true))
      );
    } else {
      return RxJsUtil.voidObs();
    }
  }

  private processQuitMsg(restartRequested: boolean, quitMessages: any): Observable<void> {
    let partsStr: string = '';

    const type: string = quitMessages.type;
    const parts: Array<string> = quitMessages.parts;

    if (parts && parts.length) {
      partsStr = parts.join('\n');
    }

    if (type === 'Warning') {
      let msg: string = '';

      if (restartRequested) {
        msg = 'Do you want to restart the session?';
      } else {
        msg = 'Do you want to close the session?';
      }

      let msgBoxIcon: MsgBoxIcon = MsgBoxIcon.Question;

      if (!String.isNullOrWhiteSpace(partsStr)) {
        msg = `${partsStr}\n\n${msg}`;
        msgBoxIcon = MsgBoxIcon.Exclamation;
      }

      return RxJsUtil.voidObs().pipe(
        tap(() => this.loaderService.fireLoadingChanged(false)),
        mergeMap(() => this.dialogService.showMsgBoxBox({
          title: this.titleService.getTitle(),
          message: msg,
          icon: msgBoxIcon,
          buttons: MsgBoxButtons.YesNo
        }).pipe(
          mergeMap(msgBoxResult => {
            if (msgBoxResult === MsgBoxResult.Yes) {
              this.eventsService.fireApplicationQuit(restartRequested);
            }

            return RxJsUtil.voidObs();
          })
        )),
        tap(() => this.loaderService.fireLoadingChanged(true))
      );
    } else if (type === 'Cancel') {
      let msg: string = '';

      if (restartRequested) {
        msg = 'The session cannot be restartet!';
      } else {
        msg = 'The session cannot be closed!';
      }

      if (!String.isNullOrWhiteSpace(partsStr)) {
        msg = `${partsStr}\n\n${msg}`;
      }

      return RxJsUtil.voidObs().pipe(
        tap(() => this.loaderService.fireLoadingChanged(false)),
        mergeMap(() => this.dialogService.showErrorBox({
          title: this.titleService.getTitle(),
          message: msg
        })),
        tap(() => this.loaderService.fireLoadingChanged(true))
      );
    } else if (type === 'Close' && !String.isNullOrWhiteSpace(partsStr)) {
      return RxJsUtil.voidObs().pipe(
        tap(() => this.loaderService.fireLoadingChanged(false)),
        mergeMap(() => this.dialogService.showMsgBoxBox({
          title: this.titleService.getTitle(),
          message: partsStr,
          icon: MsgBoxIcon.Exclamation,
          buttons: MsgBoxButtons.Ok
        }).pipe(
          mergeMap(() => RxJsUtil.voidObs())
        )),
        tap(() => this.loaderService.fireLoadingChanged(true))
      );
    }

    return RxJsUtil.voidObs();
  }

  private restartApplication(): void {
    const broker: LoginBroker = this.activeLoginBroker;
    const options: LoginOptions = this.activeLoginOptions;
    const direct: boolean = this.activeBrokerDirect;
    const token: string = this.activeBrokerToken;

    this.resetActiveBroker();

    this.store.dispatch(setBrokerState({
      state: {
        activeBrokerToken: token
      }
    }));

    this.login(broker, direct, options);
  }

  private closeApplication(): void {
    this.resetActiveBroker();
    this.routingService.showLogin();
  }

  private onAfterResponse(): Observable<void> {
    return RxJsUtil.voidObs().pipe(
      tap(() => {
        this.formsService.updateAllComponents();
        this.framesService.layout();
        this.routingService.showViewer();
        this.actionsService.processFocusActions();
      })
    );
  }

  public getLastRequestTime(): Moment.Moment {
    return this.lastRequestTime;
  }

  public getState(): any {
    return {
      requestCounter: this.requestCounter,
      clientLanguages: this.clientLanguages,
      lastRequestTime: this.lastRequestTime.toJSON(),
      loginBroker: this.activeLoginBroker,
      loginOptions: this.activeLoginOptions,
      loginDirect: this.activeBrokerDirect
    };
  }

  public setState(json: any): void {
    if (!json) {
      return;
    }

    this.requestCounter = json.requestCounter;
    this.clientLanguages = json.clientLanguages;
    this.lastRequestTime = Moment.utc(json.lastRequestTime);
    this.activeLoginBroker = json.loginBroker;
    this.activeLoginOptions = json.loginOptions;
    this.activeBrokerDirect = json.loginDirect;
  }
}

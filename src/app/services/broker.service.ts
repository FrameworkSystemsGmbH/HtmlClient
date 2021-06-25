import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClientEvent } from '@app/common/events/client-event';
import { ClientMsgBoxEvent } from '@app/common/events/client-msgbox-event';
import { InternalEvent } from '@app/common/events/internal/internal-event';
import { LoginBroker } from '@app/common/login-broker';
import { LoginOptions } from '@app/common/login-options';
import { BackButtonPriority } from '@app/enums/backbutton-priority';
import { MsgBoxButtons } from '@app/enums/msgbox-buttons';
import { MsgBoxIcon } from '@app/enums/msgbox-icon';
import { MsgBoxResult } from '@app/enums/msgbox-result';
import { RequestType } from '@app/enums/request-type';
import { ResponseResult } from '@app/enums/response-result';
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
import { resetBrokerState, setBrokerState } from '@app/store/broker/broker.actions';
import { selectBrokerState } from '@app/store/broker/broker.selectors';
import { IBrokerState } from '@app/store/broker/broker.state';
import * as JsonUtil from '@app/util/json-util';
import * as RxJsUtil from '@app/util/rxjs-util';
import { Plugins } from '@capacitor/core';
import { Store } from '@ngrx/store';
import * as Moment from 'moment-timezone';
import { forkJoin, Observable, of as obsOf, Subject, Subscription } from 'rxjs';
import { concatMap, map, mergeMap, retryWhen, tap } from 'rxjs/operators';

const { WebViewCache } = Plugins;

@Injectable()
export class BrokerService {

  private static readonly SESSION_DATA_DISCARD: string = 'DISCARD';

  private readonly _onLoginComplete: Subject<any>;
  private readonly _onLoginComplete$: Observable<any>;

  private _storeSub: Subscription;
  private _eventFiredSub: Subscription;
  private _onBackButtonListener: () => boolean;

  private _activeLoginBroker: LoginBroker;
  private _activeLoginOptions: LoginOptions;
  private _activeBrokerDirect: boolean;
  private _activeBrokerName: string;
  private _activeBrokerToken: string;
  private _activeBrokerRequestUrl: string;
  private _requestCounter: number;
  private _clientLanguages: string;
  private _lastRequestTime: Moment.Moment;

  public constructor(
    private readonly _httpClient: HttpClient,
    private readonly _actionsService: ActionsService,
    private readonly _clientDataService: ClientDataService,
    private readonly _controlStyleSerivce: ControlStyleService,
    private readonly _backService: BackService,
    private readonly _dialogService: DialogService,
    private readonly _eventsService: EventsService,
    private readonly _formsService: FormsService,
    private readonly _framesService: FramesService,
    private readonly _loaderService: LoaderService,
    private readonly _localeService: LocaleService,
    private readonly _platformService: PlatformService,
    private readonly _routingService: RoutingService,
    private readonly _textsService: TextsService,
    private readonly _titleService: TitleService,
    private readonly _store: Store
  ) {
    this._onLoginComplete = new Subject<any>();
    this._onLoginComplete$ = this._onLoginComplete.asObservable();

    this.resetActiveBroker();
  }

  private subscribeToStore(): Subscription {
    return this._store.select(selectBrokerState).subscribe((brokerState: IBrokerState) => {
      this._activeBrokerName = brokerState.activeBrokerName;
      this._activeBrokerToken = brokerState.activeBrokerToken;
      this._activeBrokerRequestUrl = brokerState.activeBrokerRequestUrl;
    });
  }

  private subscribeToEventFired(): Subscription {
    return this._eventsService.eventFired.pipe(
      concatMap(event => this.handleEvent(event))
    ).subscribe();
  }

  private handleEvent(event: InternalEvent<ClientEvent>): Observable<void> {
    return obsOf(event).pipe(
      tap(() => this._loaderService.fireLoadingChanged(true)),
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

        this._loaderService.fireLoadingChanged(false);

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
    return this._activeBrokerName;
  }

  public login(broker: LoginBroker, direct: boolean, options?: LoginOptions): void {
    if (this._activeBrokerName === broker.name) {
      this._routingService.showViewer();
    } else {
      if (this._activeBrokerName) {
        this.resetActiveBroker();
      }

      this._activeLoginBroker = broker;
      this._activeLoginOptions = options;
      this._activeBrokerDirect = direct;

      const name = broker.name;
      const url: string = broker.url;
      const fileUrl: string = `${url.trimCharsRight('/')}/`;
      const imageUrl: string = `${url.trimCharsRight('/')}/api/image`;
      const reportUrl: string = `${url.trimCharsRight('/')}/api/report`;
      const requestUrl: string = `${url.trimCharsRight('/')}/api/process`;

      if (options != null && !String.isNullOrWhiteSpace(options.languages)) {
        this._clientLanguages = options.languages;
      }

      this._store.dispatch(setBrokerState({
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
    if (this._storeSub) {
      this._storeSub.unsubscribe();
    }

    if (this._eventFiredSub) {
      this._eventFiredSub.unsubscribe();
    }

    if (this._onBackButtonListener) {
      this._backService.removeBackButtonListener(this._onBackButtonListener);
    }

    this._formsService.resetViews();
    this._store.dispatch(resetBrokerState());
    this._requestCounter = 0;
    this._clientLanguages = this._localeService.getLocale().substring(0, 2);
    this._lastRequestTime = null;
    this._activeLoginBroker = null;
    this._activeLoginOptions = null;
    this._activeBrokerDirect = null;

    this._storeSub = this.subscribeToStore();
    this._eventFiredSub = this.subscribeToEventFired();

    this._onBackButtonListener = this.onBackButton.bind(this);
    this._backService.addBackButtonListener(this._onBackButtonListener, BackButtonPriority.ActiveBroker);

    if (this._platformService.isAndroid()) {
      WebViewCache.clearCache();
    }
  }

  private onBackButton(): boolean {
    if (this._activeBrokerName != null) {
      this._eventsService.fireApplicationQuitRequest();
      return true;
    }

    return false;
  }

  public sendInitRequest(): Observable<any> {
    return this.getMetaJson(true).pipe(
      map(metaJson => ({
        meta: metaJson
      })),
      mergeMap(requestJson => this.doRequest(requestJson))
    );
  }

  private doRequest(requestJson: any): Observable<any> {
    this._lastRequestTime = Moment.utc();
    return this._httpClient.post(this._activeBrokerRequestUrl, requestJson).pipe(
      retryWhen(attempts => attempts.pipe(
        tap(() => this._loaderService.fireLoadingChanged(false)),
        mergeMap(error => this.createRequestRetryBox(error)),
        tap(() => this._loaderService.fireLoadingChanged(true))
      ))
    );
  }

  private createRequestRetryBox(error: any): Observable<void> {
    return new Observable<void>(sub => {
      try {
        const title: string = this._titleService.getTitle();
        const message: string = error && error.status === 0 ? 'Request could not be sent because of a network error!' : error.message;
        const stackTrace = error && error.stack ? error.stack : null;

        this._dialogService.showRetryBoxBox({
          title,
          message,
          stackTrace
        }).subscribe(result => {
          if (result === RetryBoxResult.Retry) {
            sub.next(null);
          } else {
            this.closeApplication();
          }
        }, err => sub.error(err), () => sub.complete());
      } catch (err: unknown) {
        sub.error(err);
      }
    });
  }

  private getMetaJson(initRequest: boolean): Observable<any> {
    const metaJson: any = {
      token: this._activeBrokerToken,
      requCounter: ++this._requestCounter,
      languages: [this._clientLanguages],
      type: RequestType.Request
    };

    if (initRequest) {
      return forkJoin([
        this._clientDataService.loadSessionData(),
        this._clientDataService.getDeviceUuid()
      ]).pipe(
        map(res => {
          const sessionData: string = res[0];
          const clientId: string = res[1];

          const platform: string = this._platformService.isNative() ? 'Mobile' : 'Web';
          const os: string = this._platformService.getOS();
          const osversion: string = this._platformService.getOSVersion();

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

        const formsJson: any = this._formsService.getFormsJson();

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
      this._store.dispatch(setBrokerState({
        state: {
          activeBrokerToken: metaJson.token
        }
      }));
    }

    const sessionData: string = metaJson.sessionData;

    if (!String.isNullOrWhiteSpace(sessionData)) {
      if (sessionData === BrokerService.SESSION_DATA_DISCARD) {
        return this._clientDataService.deleteSessionData().pipe(
          mergeMap(() => RxJsUtil.voidObs())
        );
      } else {
        return this._clientDataService.saveSessionData(sessionData).pipe(
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
        tap(() => this._titleService.setTitle(applicationJson.title))
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
            this._controlStyleSerivce.addControlStyle(controlStyleJson.name, controlStyleJson.properties);
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
            this._textsService.setText(textJson.id, textJson.value);
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
        tap(() => this._formsService.setJson(formsJson))
      );
    } else {
      return RxJsUtil.voidObs();
    }
  }

  private processActions(actionsJson: any): Observable<void> {
    if (actionsJson && actionsJson.length) {
      return RxJsUtil.voidObs().pipe(
        tap(() => this._actionsService.processActions(actionsJson))
      );
    } else {
      return RxJsUtil.voidObs();
    }
  }

  private processError(errorJson: any): Observable<void> {
    if (errorJson && !JsonUtil.isEmptyObject(errorJson)) {
      return RxJsUtil.voidObs().pipe(
        tap(() => this._loaderService.fireLoadingChanged(false)),
        mergeMap(() => this._dialogService.showErrorBox({
          title: this._titleService.getTitle(),
          message: errorJson.message,
          stackTrace: errorJson.stackTrace
        })),
        tap(() => this._loaderService.fireLoadingChanged(true))
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
        tap(() => this._loaderService.fireLoadingChanged(false)),
        mergeMap(() => this._dialogService.showMsgBoxBox({
          title: this._titleService.getTitle(),
          message: msgBoxJson.message,
          icon: msgBoxJson.icon,
          buttons: msgBoxJson.buttons
        }).pipe(
          mergeMap(result => this.handleEvent({
            clientEvent: new ClientMsgBoxEvent(formId, id, result)
          }))
        )),
        tap(() => this._loaderService.fireLoadingChanged(true))
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
        tap(() => this._loaderService.fireLoadingChanged(false)),
        mergeMap(() => this._dialogService.showMsgBoxBox({
          title: this._titleService.getTitle(),
          message: msg,
          icon: msgBoxIcon,
          buttons: MsgBoxButtons.YesNo
        }).pipe(
          mergeMap(msgBoxResult => {
            if (msgBoxResult === MsgBoxResult.Yes) {
              this._eventsService.fireApplicationQuit(restartRequested);
            }

            return RxJsUtil.voidObs();
          })
        )),
        tap(() => this._loaderService.fireLoadingChanged(true))
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
        tap(() => this._loaderService.fireLoadingChanged(false)),
        mergeMap(() => this._dialogService.showErrorBox({
          title: this._titleService.getTitle(),
          message: msg
        })),
        tap(() => this._loaderService.fireLoadingChanged(true))
      );
    } else if (type === 'Close' && !String.isNullOrWhiteSpace(partsStr)) {
      return RxJsUtil.voidObs().pipe(
        tap(() => this._loaderService.fireLoadingChanged(false)),
        mergeMap(() => this._dialogService.showMsgBoxBox({
          title: this._titleService.getTitle(),
          message: partsStr,
          icon: MsgBoxIcon.Exclamation,
          buttons: MsgBoxButtons.Ok
        }).pipe(
          mergeMap(() => RxJsUtil.voidObs())
        )),
        tap(() => this._loaderService.fireLoadingChanged(true))
      );
    }

    return RxJsUtil.voidObs();
  }

  private restartApplication(): void {
    const broker: LoginBroker = this._activeLoginBroker;
    const options: LoginOptions = this._activeLoginOptions;
    const direct: boolean = this._activeBrokerDirect;
    const token: string = this._activeBrokerToken;

    this.resetActiveBroker();

    this._store.dispatch(setBrokerState({
      state: {
        activeBrokerToken: token
      }
    }));

    this.login(broker, direct, options);
  }

  private closeApplication(): void {
    this.resetActiveBroker();
    this._routingService.showLogin();
  }

  private onAfterResponse(): Observable<void> {
    return RxJsUtil.voidObs().pipe(
      tap(() => {
        this._formsService.checkEmptyApp();
        this._formsService.updateAllComponents();
        this._framesService.layout();
        this._routingService.showViewer();
        this._actionsService.processFocusActions();
      })
    );
  }

  public getLastRequestTime(): Moment.Moment {
    return this._lastRequestTime;
  }

  public saveState(): any {
    return {
      requestCounter: this._requestCounter,
      clientLanguages: this._clientLanguages,
      lastRequestTime: this._lastRequestTime.toJSON(),
      loginBroker: this._activeLoginBroker,
      loginOptions: this._activeLoginOptions,
      loginDirect: this._activeBrokerDirect
    };
  }

  public loadState(json: any): void {
    if (!json) {
      return;
    }

    this._requestCounter = json.requestCounter;
    this._clientLanguages = json.clientLanguages;
    this._lastRequestTime = Moment.utc(json.lastRequestTime);
    this._activeLoginBroker = json.loginBroker;
    this._activeLoginOptions = json.loginOptions;
    this._activeBrokerDirect = json.loginDirect;
  }
}

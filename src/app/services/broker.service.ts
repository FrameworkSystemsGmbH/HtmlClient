import { HttpClient } from '@angular/common/http';
import { inject, Injectable, NgZone } from '@angular/core';
import { ClientEvent } from '@app/common/events/client-event';
import { ClientMsgBoxEvent } from '@app/common/events/client-msgbox-event';
import { InternalEvent } from '@app/common/events/internal/internal-event';
import { LoginBroker } from '@app/common/login-broker';
import { LoginOptions } from '@app/common/login-options';
import { BackButtonPriority } from '@app/enums/backbutton-priority';
import { MsgBoxButtons } from '@app/enums/msgbox-buttons';
import { MsgBoxDefaultButton } from '@app/enums/msgbox-defaultbutton';
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
import { WebViewCacheService } from '@app/services/webviewcache.service';
import { IAppState } from '@app/store/app.state';
import { resetBrokerState, setBrokerStateNoToken, setBrokerStateToken } from '@app/store/broker/broker.actions';
import { selectBrokerState } from '@app/store/broker/broker.selectors';
import { IBrokerState } from '@app/store/broker/broker.state';
import { setDisableFormNavigation, setTitle } from '@app/store/runtime/runtime.actions';
import { selectTitle } from '@app/store/runtime/runtime.selectors';
import * as JsonUtil from '@app/util/json-util';
import * as RxJsUtil from '@app/util/rxjs-util';
import { Store } from '@ngrx/store';
import * as Moment from 'moment-timezone';
import { defer, Observable, of as obsOf, Subject, Subscription, throwError, timer } from 'rxjs';
import { concatMap, map, mergeMap, retry, switchMap, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BrokerService {

  private static readonly SESSION_DATA_DISCARD: string = 'DISCARD';

  private readonly _httpClient = inject(HttpClient);
  private readonly _actionsService = inject(ActionsService);
  private readonly _clientDataService = inject(ClientDataService);
  private readonly _controlStyleService = inject(ControlStyleService);
  private readonly _backService = inject(BackService);
  private readonly _dialogService = inject(DialogService);
  private readonly _eventsService = inject(EventsService);
  private readonly _formsService = inject(FormsService);
  private readonly _framesService = inject(FramesService);
  private readonly _loaderService = inject(LoaderService);
  private readonly _localeService = inject(LocaleService);
  private readonly _platformService = inject(PlatformService);
  private readonly _routingService = inject(RoutingService);
  private readonly _textsService = inject(TextsService);
  private readonly _store = inject(Store<IAppState>);
  private readonly _zone = inject(NgZone);
  private readonly _webviewcacheService = inject(WebViewCacheService);

  private readonly _onLoginComplete: Subject<void>;
  private readonly _onLoginComplete$: Observable<void>;

  private _titleSub: Subscription | null = null;
  private _brokerStateSub: Subscription | null = null;
  private _eventFiredSub: Subscription | null = null;
  private _onBackButtonListener: (() => boolean) | null = null;

  private _title: string = String.empty();
  private _activeLoginBroker: LoginBroker | null = null;
  private _activeLoginOptions: LoginOptions | null = null;
  private _activeBrokerDirect: boolean = false;
  private _activeBrokerName: string | null = null;
  private _activeBrokerToken: string = String.empty();
  private _activeBrokerRequestUrl: string | null = null;
  private _clientLanguages: string | null = null;
  private _lastRequestTime: Moment.Moment | null = null;
  private _requestCounter: number = 0;

  public constructor() {

    this._onLoginComplete = new Subject<void>();
    this._onLoginComplete$ = this._onLoginComplete.asObservable();

    this.resetActiveBroker();
  }

  private subscribeToTitle(): Subscription {
    return this._store.select(selectTitle).subscribe({
      next: (title: string) => {
        this._title = title;
      }
    });
  }

  private subscribeToBrokerState(): Subscription {
    return this._store.select(selectBrokerState).subscribe({
      next: (brokerState: IBrokerState) => {
        this._activeBrokerName = brokerState.activeBrokerName;
        this._activeBrokerToken = brokerState.activeBrokerToken;
        this._activeBrokerRequestUrl = brokerState.activeBrokerRequestUrl;
      }
    });
  }

  /** Hier werden alle internal Events verarbeitet.
   * ConcatMap kümmert sich um die richtige Abarbeitung der Events.
   */
  private subscribeToEventFired(): Subscription {
    return this._eventsService.eventFired.pipe(
      concatMap(event => this.handleEvent(event))
    ).subscribe();
  }

  private handleEvent(event: InternalEvent<ClientEvent>): Observable<void> {
    return obsOf(event).pipe(
      tap(() => this._loaderService.fireLoadingChanged(true)),
      mergeMap(() => {
        if (!event.callbacks || event.callbacks.canExecute(event.payload)) {
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
          event.callbacks.onExecuted(event.payload, handleResult.processedEvent);
        }
        if (event.callbacks && event.callbacks.onCompleted) {
          event.callbacks.onCompleted(event.payload, handleResult.processedEvent);
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

  public get onLoginComplete(): Observable<void> {
    return this._onLoginComplete$;
  }

  public getActiveBrokerName(): string | null {
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
      this._activeLoginOptions = options ?? null;
      this._activeBrokerDirect = direct;

      const name = broker.name;
      const url: string = broker.url;
      const fileUrl: string = `${url.trimCharsRight('/')}/`;
      const imageUrl: string = `${url.trimCharsRight('/')}/api/image`;
      const reportUrl: string = `${url.trimCharsRight('/')}/api/report`;
      const requestUrl: string = `${url.trimCharsRight('/')}/api/process`;

      if (options != null && options.languages != null && options.languages.length > 0) {
        this._clientLanguages = options.languages;
      }

      this._store.dispatch(setBrokerStateNoToken({
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
    this._titleSub?.unsubscribe();
    this._brokerStateSub?.unsubscribe();
    this._eventFiredSub?.unsubscribe();

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
    this._activeBrokerDirect = false;

    this._titleSub = this.subscribeToTitle();
    this._brokerStateSub = this.subscribeToBrokerState();
    this._eventFiredSub = this.subscribeToEventFired();

    this._onBackButtonListener = this.onBackButton.bind(this);
    this._backService.addBackButtonListener(this._onBackButtonListener, BackButtonPriority.ActiveBroker);

    if (this._platformService.isAndroid()) {
      this._webviewcacheService.clearCache().catch(err => {
        this._zone.run(() => {
          throw Error.ensureError(err);
        });
      });
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
    if (this._activeBrokerRequestUrl == null || this._activeBrokerRequestUrl.trim().length === 0) {
      throw new Error('Broker request url is not set!');
    }

    this._lastRequestTime = Moment.utc();

    const requestUrl: string = this._activeBrokerRequestUrl;
    const maxRetries: number = 3;

    return defer(() => this._httpClient.post(requestUrl, requestJson)).pipe(
      tap(() => this._loaderService.fireLoadingChanged(true)),
      retry({
        count: maxRetries,
        delay: (error, _) => {
          this._loaderService.fireLoadingChanged(false);

          return this.createRequestRetryBox(error).pipe(
            switchMap(retryAllowed => {
              if (retryAllowed) {
                return timer(1000);
              } else {
                return throwError(() => error);
              }
            }),
            tap(() => this._loaderService.fireLoadingChanged(true))
          );
        }
      })
    );
  }

  private createRequestRetryBox(error: any): Observable<boolean> {
    return new Observable<boolean>(sub => {
      try {
        const title: string = this._title;
        const message: string = error && error.status === 0 ? 'Request could not be sent because of a network error!' : error.message;
        const stackTrace = error && error.stack ? error.stack : null;

        this._dialogService.showRetryBox({
          title,
          message,
          stackTrace
        }).subscribe({
          next: result => {
            if (result === RetryBoxResult.Retry) {
              sub.next(true);
            } else {
              this.closeApplication();
              sub.next(false);
            }
          },
          error: err => sub.error(err),
          complete: () => sub.complete()
        });
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
      return this._clientDataService.getDeviceUuid().pipe(
        map(id => {
          const sessionData: string | null = this._clientDataService.loadSessionData();
          const clientId: string = id;

          const platform: string = this._platformService.isNative() ? 'Mobile' : 'Web';
          const os: string = this._platformService.getOS();
          const osversion: string = this._platformService.getOSVersion();

          if (sessionData != null && sessionData.trim().length > 0) {
            metaJson.sessionData = sessionData;
          }

          let clientInfos: any = {
            Platform: platform,
            OS: os,
            OSVersion: osversion
          };

          if (clientId.trim().length > 0) {
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
      this._store.dispatch(setBrokerStateToken({
        token: metaJson.token
      }));
    }

    const sessionData: string | null = metaJson.sessionData;

    if (sessionData != null && sessionData.trim().length > 0) {
      if (sessionData === BrokerService.SESSION_DATA_DISCARD) {
        this._clientDataService.deleteSessionData();
      } else {
        this._clientDataService.saveSessionData(sessionData);
      }
    }

    return RxJsUtil.voidObs();
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
    if (applicationJson) {
      return RxJsUtil.voidObs().pipe(
        tap(() => {
          if (applicationJson.title != null && applicationJson.title.trim().length > 0) {
            this._store.dispatch(setTitle({ title: applicationJson.title }));
          }

          if (applicationJson.disableFormNavigation) {
            this._store.dispatch(setDisableFormNavigation({ disableFormNavigation: true }));
          }
        })
      );
    } else {
      return RxJsUtil.voidObs();
    }
  }

  private processControlStyles(controlStylesJson: any): Observable<void> {
    if (controlStylesJson != null && controlStylesJson.length > 0) {
      return RxJsUtil.voidObs().pipe(
        tap(() => {
          for (const controlStyleJson of controlStylesJson) {
            this._controlStyleService.addControlStyle(controlStyleJson.name, controlStyleJson.properties);
          }
        })
      );
    } else {
      return RxJsUtil.voidObs();
    }
  }

  private processTexts(textsJson: any): Observable<void> {
    if (textsJson != null && textsJson.length > 0) {
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
    if (formsJson != null && formsJson.length > 0) {
      return RxJsUtil.voidObs().pipe(
        tap(() => this._formsService.setJson(formsJson))
      );
    } else {
      return RxJsUtil.voidObs();
    }
  }

  private processActions(actionsJson: any): Observable<void> {
    if (actionsJson != null && actionsJson.length > 0) {
      return RxJsUtil.voidObs().pipe(
        tap(() => this._actionsService.processActions(actionsJson))
      );
    } else {
      return RxJsUtil.voidObs();
    }
  }

  private processError(errorJson: any): Observable<void> {
    if (errorJson != null && !JsonUtil.isEmptyObject(errorJson)) {
      return RxJsUtil.voidObs().pipe(
        // Loading Balken ausschalten, damit mit ErrorBox interagiert werden kann
        tap(() => this._loaderService.fireLoadingChanged(false)),
        mergeMap(() => this._dialogService.showErrorBox({
          title: this._title,
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
    if (msgBoxesJson != null && msgBoxesJson.length > 0) {
      const msgBoxJson: any = msgBoxesJson[0];
      const formId: string = msgBoxJson.formId;
      const id: string = msgBoxJson.id;

      return RxJsUtil.voidObs().pipe(
        tap(() => this._loaderService.fireLoadingChanged(false)),
        mergeMap(() => this._dialogService.showMsgBox({
          title: this._title,
          message: msgBoxJson.message,
          icon: msgBoxJson.icon,
          buttons: msgBoxJson.buttons,
          defaultButton: msgBoxJson.defaultButton
        }).pipe(
          mergeMap(result => this.handleEvent(new InternalEvent<ClientMsgBoxEvent>(new ClientMsgBoxEvent(formId, id, result))))
        )),
        tap(() => this._loaderService.fireLoadingChanged(true))
      );
    } else {
      return RxJsUtil.voidObs();
    }
  }

  private processQuitMsg(restartRequested: boolean, quitMessages: any): Observable<void> {
    let partsStr: string = String.empty();

    const type: string = quitMessages.type;
    const parts: Array<string> | null = quitMessages.parts;

    if (parts != null && parts.length > 0) {
      partsStr = parts.join('\n');
    }

    if (type === 'Warning') {
      let msg: string = String.empty();

      if (restartRequested) {
        msg = 'Do you want to restart the session?';
      } else {
        msg = 'Do you want to close the session?';
      }

      let msgBoxIcon: MsgBoxIcon = MsgBoxIcon.Question;

      if (partsStr.trim().length > 0) {
        msg = `${partsStr}\n\n${msg}`;
        msgBoxIcon = MsgBoxIcon.Exclamation;
      }

      return RxJsUtil.voidObs().pipe(
        tap(() => this._loaderService.fireLoadingChanged(false)),
        mergeMap(() => this._dialogService.showMsgBox({
          title: this._title,
          message: msg,
          icon: msgBoxIcon,
          buttons: MsgBoxButtons.YesNo,
          defaultButton: MsgBoxDefaultButton.Last
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
      let msg: string = String.empty();

      if (restartRequested) {
        msg = 'The session cannot be restartet!';
      } else {
        msg = 'The session cannot be closed!';
      }

      if (partsStr.trim().length > 0) {
        msg = `${partsStr}\n\n${msg}`;
      }

      return RxJsUtil.voidObs().pipe(
        tap(() => this._loaderService.fireLoadingChanged(false)),
        mergeMap(() => this._dialogService.showErrorBox({
          title: this._title,
          message: msg
        })),
        tap(() => this._loaderService.fireLoadingChanged(true))
      );
    } else if (type === 'Close' && partsStr.trim().length > 0) {
      return RxJsUtil.voidObs().pipe(
        tap(() => this._loaderService.fireLoadingChanged(false)),
        mergeMap(() => this._dialogService.showMsgBox({
          title: this._title,
          message: partsStr,
          icon: MsgBoxIcon.Exclamation,
          buttons: MsgBoxButtons.Ok,
          defaultButton: MsgBoxDefaultButton.Last
        }).pipe(
          mergeMap(() => RxJsUtil.voidObs())
        )),
        tap(() => this._loaderService.fireLoadingChanged(true))
      );
    }

    return RxJsUtil.voidObs();
  }

  private restartApplication(): void {
    if (this._activeLoginBroker != null) {
      const broker: LoginBroker = this._activeLoginBroker;
      const options: LoginOptions | undefined = this._activeLoginOptions ?? undefined;
      const direct: boolean = this._activeBrokerDirect;
      const token: string = this._activeBrokerToken;

      this.resetActiveBroker();

      this._store.dispatch(setBrokerStateToken({ token }));

      this.login(broker, direct, options);
    }
  }

  private closeApplication(): void {
    this.resetActiveBroker();
    this._routingService.showLogin();
  }

  /** JSON wurde komplett verarbeitet. Jetzt muss Viewer, Layout und Angular Components gezeichnet werden. */
  private onAfterResponse(): Observable<void> {
    return RxJsUtil.voidObs().pipe(
      tap(() => {
        this._formsService.checkEmptyApp();
        this._formsService.updateAllComponents();
        this._framesService.layout();
        // Es wird zur Viewer Component navigiert
        this._routingService.showViewer();
        // die können erst ausgeführt werden, wenn die Angular Components gezeichnet sind (im DOM sind)
        this._actionsService.processFocusActions();
      })
    );
  }

  public getLastRequestTime(): Moment.Moment | null {
    return this._lastRequestTime;
  }

  public saveState(): any {
    return {
      requestCounter: this._requestCounter,
      clientLanguages: this._clientLanguages,
      lastRequestTime: this._lastRequestTime != null ? this._lastRequestTime.toJSON() : null,
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
    this._lastRequestTime = json.lastRequestTime != null ? Moment.utc(json.lastRequestTime) : null;
    this._activeLoginBroker = json.loginBroker;
    this._activeLoginOptions = json.loginOptions;
    this._activeBrokerDirect = json.loginDirect;
  }
}

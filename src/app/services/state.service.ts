import { Injectable, NgZone } from '@angular/core';
import { LastSessionInfo } from '@app/common/last-session-info';
import { CameraService } from '@app/services/actions/camera.service';
import { BackService } from '@app/services/back-service';
import { BrokerService } from '@app/services/broker.service';
import { ControlStyleService } from '@app/services/control-style.service';
import { FormsService } from '@app/services/forms.service';
import { PlatformService } from '@app/services/platform.service';
import { RoutingService } from '@app/services/routing.service';
import { WebStorageService } from '@app/services/storage/web-storage.service';
import { TextsService } from '@app/services/texts.service';
import { IAppState } from '@app/store/app.state';
import { setBrokerState } from '@app/store/broker/broker.actions';
import { selectBrokerState } from '@app/store/broker/broker.selectors';
import { IBrokerState } from '@app/store/broker/broker.state';
import { setRuntimeState } from '@app/store/runtime/runtime.actions';
import { selectRuntimeState } from '@app/store/runtime/runtime.selectors';
import { initialRuntimeState, IRuntimeState } from '@app/store/runtime/runtime.state';
import * as JsonUtil from '@app/util/json-util';
import { App, AppState, RestoredListenerEvent } from '@capacitor/app';
import { PluginListenerHandle } from '@capacitor/core';
import { Store } from '@ngrx/store';
import * as Moment from 'moment-timezone';
import { map } from 'rxjs/operators';

const SESSION_STORAGE_KEY: string = 'clientSession';
const SESSION_TIMEOUT: number = 720; // Minutes -> 12 hours

@Injectable({ providedIn: 'root' })
export class StateService {

  private readonly _zone: NgZone;
  private readonly _backService: BackService;
  private readonly _brokerService: BrokerService;
  private readonly _cameraService: CameraService;
  private readonly _controlStyleService: ControlStyleService;
  private readonly _formsService: FormsService;
  private readonly _platformService: PlatformService;
  private readonly _routingService: RoutingService;
  private readonly _store: Store<IAppState>;
  private readonly _textsService: TextsService;
  private readonly _webStorageService: WebStorageService;

  private _brokerState: IBrokerState | null = null;
  private _runtimeState: IRuntimeState | null = null;
  private _stateChangeListenerSub: PluginListenerHandle | null = null;
  private _restoredResultListenerSub: PluginListenerHandle | null = null;

  public constructor(
    zone: NgZone,
    backService: BackService,
    brokerService: BrokerService,
    cameraService: CameraService,
    controlStyleService: ControlStyleService,
    formsService: FormsService,
    platformService: PlatformService,
    routingService: RoutingService,
    store: Store<IAppState>,
    textsService: TextsService,
    webStorageService: WebStorageService
  ) {
    this._zone = zone;
    this._backService = backService;
    this._brokerService = brokerService;
    this._cameraService = cameraService;
    this._controlStyleService = controlStyleService;
    this._formsService = formsService;
    this._platformService = platformService;
    this._routingService = routingService;
    this._store = store;
    this._textsService = textsService;
    this._webStorageService = webStorageService;

    this._brokerService.onLoginComplete.pipe(
      map(() => this._webStorageService.delete(SESSION_STORAGE_KEY))
    ).subscribe();

    this._store.select(selectBrokerState).subscribe({
      next: (brokerState: IBrokerState) => {
        this._brokerState = brokerState;
      }
    });

    this._store.select(selectRuntimeState).subscribe({
      next: (runtimeState: IRuntimeState) => {
        this._runtimeState = runtimeState;
      }
    });
  }

  public attachHandlers(): void {
    if (this._platformService.isAndroid()) {
      if (this._stateChangeListenerSub == null) {
        this._stateChangeListenerSub = App.addListener('appStateChange', this.onAppStateChange.bind(this));
      }

      if (this._restoredResultListenerSub == null) {
        this._restoredResultListenerSub = App.addListener('appRestoredResult', this.onPendingResult.bind(this));
      }
    }
  }

  public removeHandlers(): void {
    if (this._platformService.isAndroid()) {
      if (this._stateChangeListenerSub != null) {
        this._stateChangeListenerSub.remove().catch(err => {
          this._zone.run(() => {
            throw Error.ensureError(err);
          });
        });

        this._stateChangeListenerSub = null;
      }

      if (this._restoredResultListenerSub != null) {
        this._restoredResultListenerSub.remove().catch(err => {
          this._zone.run(() => {
            throw Error.ensureError(err);
          });
        });

        this._restoredResultListenerSub = null;
      }
    }
  }

  private onAppStateChange(state: AppState): void {
    this._zone.run(() => {
      if (state.isActive) {
        // Delete unnecessary stored session
        this._webStorageService.delete(SESSION_STORAGE_KEY);

        // Attach back button handler
        this._backService.attachHandlers();
      } else {
        // Detach back button handler
        this._backService.removeHandlers();

        // Save state only if there is an active broker session
        if (this._brokerState != null && this._brokerState.activeBrokerName != null) {
          this.saveState();
        }
      }
    });
  }

  private onPendingResult(result: RestoredListenerEvent | null): void {
    this._zone.run(() => {
      if (result != null && result.pluginId === 'Camera' && result.methodName === 'getPhoto') {
        this._cameraService.setPendingResult(result);
      }
    });
  }

  public resumeLastSession(): void {
    const lastSessionInfo: LastSessionInfo | null = this.getLastSessionInfo();

    this._webStorageService.delete(SESSION_STORAGE_KEY);

    if (lastSessionInfo != null && this._brokerState != null && this._brokerState.activeBrokerName == null) {
      this.loadState(lastSessionInfo);
    }

    this._cameraService.processPendingResult();
  }

  public getLastSessionInfo(): LastSessionInfo | null {
    const data: string | null = this._webStorageService.load(SESSION_STORAGE_KEY);
    const stateJson: any = data != null ? JSON.parse(data) : null;

    if (!JsonUtil.isEmptyObject(stateJson)) {
      const lastRequestTime: Moment.Moment = Moment.utc(stateJson.meta.lastRequestTime);
      const isValid: boolean = lastRequestTime.isAfter(Moment.utc().subtract(Moment.duration(SESSION_TIMEOUT, 'minutes')));

      if (isValid) {
        return new LastSessionInfo(
          stateJson.meta.lastBroker,
          lastRequestTime,
          stateJson
        );
      } else {
        this._webStorageService.delete(SESSION_STORAGE_KEY);
      }
    }

    return null;
  }

  private saveState(): void {
    // App state object
    const stateJson: any = {};

    // Meta
    const lastRequestTime: Moment.Moment | null = this._brokerService.getLastRequestTime();

    stateJson.meta = {
      lastBroker: this._brokerState != null ? this._brokerState.activeBrokerName : null,
      lastRequestTime: lastRequestTime != null ? lastRequestTime.toJSON() : null
    };

    // Runtime State
    if (this._runtimeState != null) {
      if (stateJson.store == null) {
        stateJson.store = {};
      }

      stateJson.store.runtime = {
        title: this._runtimeState.title,
        diableNavigation: this._runtimeState.disableFormNavigation
      };
    }

    // Broker State
    if (this._brokerState != null) {
      if (stateJson.store == null) {
        stateJson.store = {};
      }

      stateJson.store.broker = {
        activeBrokerName: this._brokerState.activeBrokerName,
        activeBrokerToken: this._brokerState.activeBrokerToken,
        activeBrokerUrl: this._brokerState.activeBrokerUrl,
        activeBrokerDirect: this._brokerState.activeBrokerDirect,
        activeBrokerFilesUrl: this._brokerState.activeBrokerFilesUrl,
        activeBrokerImageUrl: this._brokerState.activeBrokerImageUrl,
        activeBrokerReportUrl: this._brokerState.activeBrokerReportUrl,
        activeBrokerRequestUrl: this._brokerState.activeBrokerRequestUrl
      };
    }

    // Services
    const controlStyleServiceJson: any = this._controlStyleService.saveState();
    const textsServiceJson: any = this._textsService.saveState();
    const brokerServiceJson: any = this._brokerService.saveState();
    const formsServiceJson: any = this._formsService.saveState();

    const servicesJson: any = {};

    if (!JsonUtil.isEmptyObject(controlStyleServiceJson)) {
      servicesJson.controlStyleService = controlStyleServiceJson;
    }

    if (!JsonUtil.isEmptyObject(textsServiceJson)) {
      servicesJson.textsService = textsServiceJson;
    }

    if (!JsonUtil.isEmptyObject(brokerServiceJson)) {
      servicesJson.brokerService = brokerServiceJson;
    }

    if (!JsonUtil.isEmptyObject(formsServiceJson)) {
      servicesJson.formsService = formsServiceJson;
    }

    if (!JsonUtil.isEmptyObject(servicesJson)) {
      stateJson.services = servicesJson;
    }

    if (!JsonUtil.isEmptyObject(stateJson)) {
      this._webStorageService.save(SESSION_STORAGE_KEY, JSON.stringify(stateJson));
    }
  }

  public loadState(lastSessionInfo: LastSessionInfo): void {
    this._webStorageService.delete(SESSION_STORAGE_KEY);

    const stateJson: any = lastSessionInfo.getStateJson();

    // Store
    const storeJson: any = stateJson.store;

    if (storeJson != null) {
      // Runtime State
      if (storeJson.runtime != null) {
        const runtimeStateJson: any = storeJson.runtime;

        this._store.dispatch(setRuntimeState({
          state: {
            ...initialRuntimeState,
            title: runtimeStateJson.title,
            disableFormNavigation: runtimeStateJson.diableNavigation
          }
        }));
      }

      // Broker State
      if (storeJson.broker != null) {
        const brokerStateJson = storeJson.broker;

        this._store.dispatch(setBrokerState({
          state: {
            activeBrokerDirect: brokerStateJson.activeBrokerDirect,
            activeBrokerFilesUrl: brokerStateJson.activeBrokerFilesUrl,
            activeBrokerImageUrl: brokerStateJson.activeBrokerImageUrl,
            activeBrokerName: brokerStateJson.activeBrokerName,
            activeBrokerReportUrl: brokerStateJson.activeBrokerReportUrl,
            activeBrokerRequestUrl: brokerStateJson.activeBrokerRequestUrl,
            activeBrokerToken: brokerStateJson.activeBrokerToken,
            activeBrokerUrl: brokerStateJson.activeBrokerUrl
          }
        }));
      }
    }

    // Services
    if (stateJson.services) {
      const servicesJson: any = stateJson.services;

      if (servicesJson.controlStyleService) {
        this._controlStyleService.loadState(servicesJson.controlStyleService);
      }

      if (servicesJson.textsService) {
        this._textsService.loadState(servicesJson.textsService);
      }

      if (servicesJson.brokerService) {
        this._brokerService.loadState(servicesJson.brokerService);
      }

      if (servicesJson.formsService) {
        this._formsService.loadState(servicesJson.formsService);
      }
    }

    // Redirect to the viewer
    this._routingService.showViewer();
  }
}

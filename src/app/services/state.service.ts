import { inject, Injectable, NgZone } from '@angular/core';
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
import { Store } from '@ngrx/store';
import * as Moment from 'moment-timezone';
import { from, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

const SESSION_STORAGE_KEY: string = 'clientSession';
const SESSION_TIMEOUT: number = 720; // Minutes -> 12 hours

/**
 * StateService bekommt mit, wenn Android die App killt.
 * Android kann pausierte Apps, wenn RAM Bedarf vorliegt, killen.
 * StateService serialisiert den State. Bekommt mit, wenn in gekillte App
 * zurückgesprungen wird, dann lädt der StateService das jsonfile.
 */
@Injectable({ providedIn: 'root' })
export class StateService {

  private readonly _zone = inject(NgZone);
  private readonly _backService = inject(BackService);
  private readonly _brokerService = inject(BrokerService);
  private readonly _cameraService = inject(CameraService);
  private readonly _controlStyleService = inject(ControlStyleService);
  private readonly _formsService = inject(FormsService);
  private readonly _platformService = inject(PlatformService);
  private readonly _routingService = inject(RoutingService);
  private readonly _store = inject(Store<IAppState>);
  private readonly _textsService = inject(TextsService);
  private readonly _webStorageService = inject(WebStorageService);

  private _brokerState: IBrokerState | null = null;
  private _runtimeState: IRuntimeState | null = null;
  private _stateChangeListenerSub: Subscription | null = null;
  private _restoredResultListenerSub: Subscription | null = null;

  public constructor() {
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

  /** Wenn man eine App in Android verlässt, kann es sein, dass die App vom Android-System
   * weggeschmissen wird.
   * Capacitor hat hierfür zwei Events (appStateChange/appResoredResult). Hierauf wird sich registriert.
    */
  public attachHandlers(): void {
    if (this._platformService.isAndroid()) {
      if (this._stateChangeListenerSub == null) {
        this._stateChangeListenerSub = from(App.addListener('appStateChange', this.onAppStateChange.bind(this))).subscribe({
          error: (err) => {
            this._zone.run(() => {
              throw Error.ensureError(err);
            });
          }
        });
      }

      if (this._restoredResultListenerSub == null) {
        this._restoredResultListenerSub = from(App.addListener('appRestoredResult', this.onPendingResult.bind(this))).subscribe(
          {
            error: (err) => {
              this._zone.run(() => {
                throw Error.ensureError(err);
              });
            }
          })
      }
    }
  }

  public removeHandlers(): void {
    if (this._platformService.isAndroid()) {

      this._stateChangeListenerSub?.unsubscribe();
      this._stateChangeListenerSub = null;

      this._restoredResultListenerSub?.unsubscribe();
      this._restoredResultListenerSub = null;

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
        // Wenn Applikation verlassen wurde, in einer anderen App der Backbutton gedrückt wird,
        // reagiert der BackButton im MobileClient, deshalb abmelden vom Event, wenn State nicht aktiv ist.
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

  /** Holt sich die letzte Session aus dem WebStorage und lädt diesen.
   * Wenn in die Kamera gewechselt bin und die App im Hintergrund gekillt wurde, dann
   * wird aus der Kamera trotzdem das Bild ausgelesen, obwohl App weg war.
  */
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

  /** Serialisiert die komplette Oberfläche: Wrapper (aus welchen wieder AngularComponents aufgebaut werden können)
   * Services, Daten in Services, ...
   * und speichert das JSON im WebStorage. */
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

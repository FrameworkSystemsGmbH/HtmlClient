import { Injectable, NgZone } from '@angular/core';
import { LastSessionInfo } from '@app/common/last-session-info';
import { BarcodeService } from '@app/services/actions/barcode.service';
import { CameraService } from '@app/services/actions/camera.service';
import { BackService } from '@app/services/back-service';
import { BrokerService } from '@app/services/broker.service';
import { ControlStyleService } from '@app/services/control-style.service';
import { FormsService } from '@app/services/forms.service';
import { PlatformService } from '@app/services/platform.service';
import { RoutingService } from '@app/services/routing.service';
import { StorageService } from '@app/services/storage.service';
import { TextsService } from '@app/services/texts.service';
import { TitleService } from '@app/services/title.service';
import { setBrokerState } from '@app/store/broker/broker.actions';
import { selectBrokerState } from '@app/store/broker/broker.selectors';
import { IBrokerState } from '@app/store/broker/broker.state';
import * as JsonUtil from '@app/util/json-util';
import { AppRestoredResult, AppState, Plugins } from '@capacitor/core';
import { Store } from '@ngrx/store';
import * as Moment from 'moment-timezone';
import { Observable, of as obsOf } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';

const SESSION_STORAGE_KEY: string = 'clientSession';
const SESSION_TIMEOUT: number = 720; // Minutes -> 12 hours

const { App } = Plugins;

@Injectable()
export class StateService {

  private brokerState: IBrokerState;

  public constructor(
    private zone: NgZone,
    private barcodeService: BarcodeService,
    private backService: BackService,
    private brokerService: BrokerService,
    private controlStyleService: ControlStyleService,
    private formsService: FormsService,
    private cameraService: CameraService,
    private platformService: PlatformService,
    private routingService: RoutingService,
    private storageService: StorageService,
    private store: Store,
    private textsService: TextsService,
    private titleService: TitleService
  ) {
    this.brokerService.onLoginComplete.pipe(
      mergeMap(() => this.storageService.delete(SESSION_STORAGE_KEY))
    ).subscribe();

    this.store.select(selectBrokerState).subscribe((brokerState: IBrokerState) => {
      this.brokerState = brokerState;
    });
  }

  public attachHandlers(): void {
    if (this.platformService.isAndroid()) {
      App.addListener('appStateChange', this.onAppStateChange.bind(this));
      App.addListener('appRestoredResult', this.onPendingResult.bind(this));
    }
  }

  private onAppStateChange(state: AppState): void {
    this.zone.run(() => {
      if (state.isActive) {
        // Delete unnecessary stored session
        this.storageService.delete(SESSION_STORAGE_KEY).subscribe();

        // Attach back button handler
        this.backService.attachHandlers();
      } else {
        // Detach back button handler
        this.backService.removeHandlers();

        // Save state only if there is an active broker session
        if (this.brokerState.activeBrokerName != null) {
          this.saveState();
        }
      }
    });
  }

  private onPendingResult(result: AppRestoredResult): void {
    this.zone.run(() => {
      if (result != null && result.pluginId === 'Camera' && result.methodName === 'getPhoto') {
        this.cameraService.setPendingResult(result);
      }
    });
  }

  public resumeLastSession(): Observable<void> {
    return this.getLastSessionInfo().pipe(
      tap(() => {
        this.storageService.delete(SESSION_STORAGE_KEY).subscribe();
      }),
      map(lastSessionInfo => {
        // Load state only if there is no active broker session
        if (this.brokerState.activeBrokerName == null) {
          this.loadState(lastSessionInfo);
        }
      }),
      map(() => {
        this.cameraService.processPendingResult();
      })
    );
  }

  public getLastSessionInfo(): Observable<LastSessionInfo> {
    return this.storageService.load(SESSION_STORAGE_KEY).pipe(
      mergeMap(data => {
        const stateJson: any = JSON.parse(data);

        if (!JsonUtil.isEmptyObject(stateJson)) {
          const lastRequestTime: Moment.Moment = Moment.utc(stateJson.meta.lastRequestTime);
          const isValid: boolean = lastRequestTime.isAfter(Moment.utc().subtract(Moment.duration(SESSION_TIMEOUT, 'minutes')));

          if (isValid) {
            return obsOf(new LastSessionInfo(
              stateJson.meta.lastBroker,
              lastRequestTime,
              stateJson
            ));
          } else {
            return this.storageService.delete(SESSION_STORAGE_KEY).pipe(
              map(() => null as LastSessionInfo)
            );
          }
        }

        return obsOf(null as LastSessionInfo);
      })
    );
  }

  private saveState(): void {
    // App state object
    const stateJson: any = {};

    // App Title
    const title: string = this.titleService.getTitle();
    if (!String.isNullOrWhiteSpace(title)) {
      stateJson.title = title;
    }

    // Meta
    stateJson.meta = {
      lastBroker: this.brokerState.activeBrokerName,
      lastRequestTime: this.brokerService.getLastRequestTime().toJSON()
    };

    // Store
    stateJson.store = {
      activeBrokerName: this.brokerState.activeBrokerName,
      activeBrokerToken: this.brokerState.activeBrokerToken,
      activeBrokerUrl: this.brokerState.activeBrokerUrl,
      activeBrokerDirect: this.brokerState.activeBrokerDirect,
      activeBrokerFilesUrl: this.brokerState.activeBrokerFilesUrl,
      activeBrokerImageUrl: this.brokerState.activeBrokerImageUrl,
      activeBrokerReportUrl: this.brokerState.activeBrokerReportUrl,
      activeBrokerRequestUrl: this.brokerState.activeBrokerRequestUrl
    };

    // Services
    const controlStyleServiceJson: any = this.controlStyleService.saveState();
    const textsServiceJson: any = this.textsService.saveState();
    const brokerServiceJson: any = this.brokerService.saveState();
    const formsServiceJson: any = this.formsService.saveState();

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
      this.storageService.save(SESSION_STORAGE_KEY, JSON.stringify(stateJson)).subscribe();
    }
  }

  public loadState(lastSessionInfo: LastSessionInfo): void {
    this.storageService.delete(SESSION_STORAGE_KEY).subscribe();

    if (lastSessionInfo == null) {
      return;
    }

    const stateJson: any = lastSessionInfo.getStateJson();

    // Common Properties
    if (!String.isNullOrWhiteSpace(stateJson.title)) {
      this.titleService.setTitle(stateJson.title);
    }

    // Store
    const store: any = stateJson.store;
    this.store.dispatch(setBrokerState({
      state: {
        activeBrokerDirect: store.activeBrokerDirect,
        activeBrokerFilesUrl: store.activeBrokerFilesUrl,
        activeBrokerImageUrl: store.activeBrokerImageUrl,
        activeBrokerName: store.activeBrokerName,
        activeBrokerReportUrl: store.activeBrokerReportUrl,
        activeBrokerRequestUrl: store.activeBrokerRequestUrl,
        activeBrokerToken: store.activeBrokerToken,
        activeBrokerUrl: store.activeBrokerUrl
      }
    }));

    // Services
    if (stateJson.services) {
      const servicesJson: any = stateJson.services;

      if (servicesJson.controlStyleService) {
        this.controlStyleService.loadState(servicesJson.controlStyleService);
      }

      if (servicesJson.textsService) {
        this.textsService.loadState(servicesJson.textsService);
      }

      if (servicesJson.brokerService) {
        this.brokerService.loadState(servicesJson.brokerService);
      }

      if (servicesJson.formsService) {
        this.formsService.loadState(servicesJson.formsService);
      }
    }

    // Redirect to the viewer
    this.routingService.showViewer();
  }
}

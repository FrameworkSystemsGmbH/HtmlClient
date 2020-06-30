import { Injectable, NgZone } from '@angular/core';
import { Observable, of as obsOf } from 'rxjs';
import { flatMap, map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { BarcodeService } from 'app/services/actions/barcode.service';
import { BackService } from 'app/services/back-service';
import { BrokerService } from 'app/services/broker.service';
import { ControlStyleService } from 'app/services/control-style.service';
import { FormsService } from 'app/services/forms.service';
import { CameraService } from 'app/services/actions/camera.service';
import { PlatformService } from 'app/services/platform/platform.service';
import { StorageService } from 'app/services/storage/storage.service';
import { RoutingService } from 'app/services/routing.service';
import { TextsService } from 'app/services/texts.service';
import { TitleService } from 'app/services/title.service';
import { LastSessionInfo } from 'app/common/last-session-info';

import * as Moment from 'moment-timezone';
import * as JsonUtil from 'app/util/json-util';
import * as fromAppReducers from 'app/app.reducers';
import * as fromBrokerReducers from 'app/store/broker.reducers';
import * as fromBrokerActions from 'app/store/broker.actions';

const SESSION_STORAGE_KEY: string = 'clientSession';
const SESSION_TIMEOUT: number = 720; // Minutes -> 12 hours

@Injectable()
export class StateService {

  private brokerState: fromBrokerReducers.IBrokerState;

  constructor(
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
    private store: Store<fromAppReducers.IAppState>,
    private textsService: TextsService,
    private titleService: TitleService
  ) {
    this.brokerService.onLoginComplete.pipe(
      flatMap(() => this.storageService.delete(SESSION_STORAGE_KEY))
    ).subscribe();

    this.store.select(appState => appState.broker).subscribe(brokerState => {
      this.brokerState = brokerState;
    });
  }

  public attachHandlers(): void {
    if (this.platformService.isAndroid()) {
      document.addEventListener('pause', this.onPause.bind(this), false);
      document.addEventListener('resume', this.onResume.bind(this), false);
    }
  }

  private onPause(): void {
    this.zone.run(() => {
      // Detach back button handler
      this.backService.removeHandlers();

      // Save state only if there is an active broker session
      if (this.brokerState.activeBrokerName != null) {
        this.saveState();
      }
    });
  }

  private onResume(event: any): void {
    setTimeout(() => {
      this.zone.run(() => {
        this.getLastSessionInfo().pipe(
          tap(() => {
            this.storageService.delete(SESSION_STORAGE_KEY).subscribe();
          }),
          map(lastSessionInfo => {
            // Load state only if there is no active broker session
            if (this.brokerState.activeBrokerName == null) {
              this.loadState(lastSessionInfo);
            }
          }),
          tap(() => {
            if (event != null && event.pendingResult != null && event.pendingResult.pluginServiceName === 'BarcodeScanner') {
              this.barcodeService.processPendingResult(event.pendingResult);
            } else if (event != null && event.pendingResult != null && event.pendingResult.pluginServiceName === 'Camera') {
              this.cameraService.processPendingResult(event.pendingResult);
            }
          }),
          tap(() => {
            // Attach back button handler
            this.backService.attachHandlers();
          })
        ).subscribe();
      });
    });
  }

  public getLastSessionInfo(): Observable<LastSessionInfo> {
    return this.storageService.loadData(SESSION_STORAGE_KEY).pipe(
      flatMap(data => {
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
      activeBrokerRequestUrl: this.brokerState.activeBrokerRequestUrl
    };

    // Services
    const controlStyleServiceJson: any = this.controlStyleService.getState();
    const textsServiceJson: any = this.textsService.getState();
    const brokerServiceJson: any = this.brokerService.getState();
    const formsServiceJson: any = this.formsService.getState();

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
      this.storageService.saveData(SESSION_STORAGE_KEY, JSON.stringify(stateJson)).subscribe();
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
    this.store.dispatch(new fromBrokerActions.SetBrokerNameAction(store.activeBrokerName));
    this.store.dispatch(new fromBrokerActions.SetBrokerTokenAction(store.activeBrokerToken));
    this.store.dispatch(new fromBrokerActions.SetBrokerUrlAction(store.activeBrokerUrl));
    this.store.dispatch(new fromBrokerActions.SetBrokerDirectAction(store.activeBrokerDirect));
    this.store.dispatch(new fromBrokerActions.SetBrokerFilesUrlAction(store.activeBrokerFilesUrl));
    this.store.dispatch(new fromBrokerActions.SetBrokerImageUrlAction(store.activeBrokerImageUrl));
    this.store.dispatch(new fromBrokerActions.SetBrokerRequestUrlAction(store.activeBrokerRequestUrl));

    // Services
    if (stateJson.services) {
      const servicesJson: any = stateJson.services;

      if (servicesJson.controlStyleService) {
        this.controlStyleService.setState(servicesJson.controlStyleService);
      }

      if (servicesJson.textsService) {
        this.textsService.setState(servicesJson.textsService);
      }

      if (servicesJson.brokerService) {
        this.brokerService.setState(servicesJson.brokerService);
      }

      if (servicesJson.formsService) {
        this.formsService.setState(servicesJson.formsService);
      }
    }

    // Redirect to the viewer
    this.routingService.showViewer();
  }
}

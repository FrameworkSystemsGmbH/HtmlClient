import { Injectable, NgZone } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';

import { IBrokerState } from 'app/store/broker.reducers';

import { BrokerService } from 'app/services/broker.service';
import { ControlStyleService } from 'app/services/control-style.service';
import { FormsService } from 'app/services/forms.service';
import { PlatformService } from 'app/services/platform.service';
import { StorageService } from 'app/services/storage.service';
import { RoutingService } from 'app/services/routing.service';
import { TextsService } from 'app/services/texts.service';
import { JsonUtil } from 'app/util/json-util';

import * as fromAppReducers from 'app/app.reducers';
import * as fromBrokerActions from 'app/store/broker.actions';

const SESSION_STORAGE_KEY: string = 'clientSession';

@Injectable()
export class SerializeService {

  private brokerState: IBrokerState;

  constructor(
    private zone: NgZone,
    private brokerService: BrokerService,
    private controlStyleService: ControlStyleService,
    private formsService: FormsService,
    private platformService: PlatformService,
    private routingService: RoutingService,
    private storageService: StorageService,
    private store: Store<fromAppReducers.IAppState>,
    private textsService: TextsService,
    private titleService: Title
  ) {
    this.store.select(appState => appState.broker).subscribe(brokerState => {
      this.brokerState = brokerState;
    });
  }

  public attachHandlers(): void {
    if (this.platformService.isAndroid()) {
      document.addEventListener('pause', this.onPause.bind(this));
      document.addEventListener('resume', this.onResume.bind(this));
    }
  }

  public onPause(event: any): void {
    this.zone.run(() => {
      // Serialize client only if logged on to a broker
      if (this.brokerState.activeBrokerName == null) {
        // Delete existing client session just in case
        this.storageService.delete(SESSION_STORAGE_KEY);
        return;
      }

      const stateJson: any = {};

      // Common Properties
      const title: string = this.titleService.getTitle();

      if (!String.isNullOrWhiteSpace(title)) {
        stateJson.title = title;
      }

      // Store
      stateJson.store = {
        activeBrokerName: this.brokerState.activeBrokerName,
        activeBrokerToken: this.brokerState.activeBrokerToken,
        activeBrokerUrl: this.brokerState.activeBrokerUrl,
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
        this.storageService.saveData(SESSION_STORAGE_KEY, JSON.stringify(stateJson));
      }
    });
  }

  public onResume(event: any): void {
    setTimeout(() => {
      this.zone.run(() => {
        const stateJson: any = JSON.parse(this.storageService.loadData(SESSION_STORAGE_KEY));

        // Clean up storage
        this.storageService.delete(SESSION_STORAGE_KEY);

        // Deserialize state only if there is no active broker session
        if (this.brokerState.activeBrokerName != null || JsonUtil.isEmptyObject(stateJson)) {
          return;
        }

        // Common Properties
        if (!String.isNullOrWhiteSpace(stateJson.title)) {
          this.titleService.setTitle(stateJson.title);
        }

        // Store
        const store: any = stateJson.store;
        this.store.dispatch(new fromBrokerActions.SetBrokerNameAction(store.activeBrokerName));
        this.store.dispatch(new fromBrokerActions.SetBrokerTokenAction(store.activeBrokerToken));
        this.store.dispatch(new fromBrokerActions.SetBrokerUrlAction(store.activeBrokerUrl));
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
      });
    });
  }
}

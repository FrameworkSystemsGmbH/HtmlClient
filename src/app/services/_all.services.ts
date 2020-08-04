import { NgZone } from '@angular/core';

import { ActionsService } from 'app/services/actions.service';
import { BackService } from 'app/services/back-service';
import { BarcodeService } from 'app/services/actions/barcode.service';
import { BrokerService } from 'app/services/broker.service';
import { CameraService } from 'app/services/actions/camera.service';
import { ClientDataService } from 'app/services/client-data.service';
import { ControlStyleService } from 'app/services/control-style.service';
import { ControlsService } from 'app/services/controls.service';
import { DialogService } from 'app/services/dialog.service';
import { EventsService } from 'app/services/events.service';
import { FocusService } from 'app/services/focus.service';
import { FontService } from 'app/services/font.service';
import { FormsService } from 'app/services/forms.service';
import { FramesService } from 'app/services/frames.service';
import { GeoLocationService } from 'app/services/actions/geolocation.service';
import { ImageService } from 'app/services/image.service';
import { KeyboardService } from 'app/services/keyboard.service';
import { LoaderService } from 'app/services/loader.service';
import { LoginService } from 'app/services/login.service';
import { LogService } from 'app/services/log.service';
import { LocaleService } from 'app/services/locale.service';
import { PlatformService } from 'app/services/platform.service';
import { RoutingService } from 'app/services/routing.service';
import { StateService } from 'app/services/state.service';
import { StatusBarService } from 'app/services/statusbar.service';
import { TextsService } from 'app/services/texts.service';
import { TitleService } from 'app/services/title.service';
import { ViewDocService } from 'app/services/actions/viewdoc.service';

import { BaseFormatService } from 'app/services/formatter/base-format.service';
import { DateTimeFormatService } from 'app/services/formatter/datetime-format.service';
import { NumberFormatService } from 'app/services/formatter/number-format.service';
import { PatternFormatService } from 'app/services/formatter/pattern-format.service';
import { StringFormatService } from 'app/services/formatter/string-format.service';

import { LocalStorageService } from 'app/services/storage/local-storage.service';
import { MobileStorageService } from 'app/services/storage/mobile-storage.service';
import { StorageService } from 'app/services/storage/storage.service';

const storageServiceProvider = {
  provide: StorageService,
  useFactory: (platformService: PlatformService, zone: NgZone) => {
    return platformService.isNative() ? new MobileStorageService(zone) : new LocalStorageService();
  },
  deps: [PlatformService, NgZone]
};

const formatterServices = [
  BaseFormatService,
  DateTimeFormatService,
  NumberFormatService,
  PatternFormatService,
  StringFormatService
];

const services = [
  ActionsService,
  BackService,
  BarcodeService,
  BrokerService,
  CameraService,
  ClientDataService,
  ControlStyleService,
  ControlsService,
  DialogService,
  EventsService,
  FocusService,
  FontService,
  FormsService,
  FramesService,
  GeoLocationService,
  ImageService,
  KeyboardService,
  LoaderService,
  LocalStorageService,
  LoginService,
  LogService,
  LocaleService,
  PlatformService,
  RoutingService,
  StateService,
  StatusBarService,
  TextsService,
  TitleService,
  ViewDocService
];

export const ALL_SERVICES = [
  storageServiceProvider,
  formatterServices,
  services
];

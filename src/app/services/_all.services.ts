import { NgZone } from '@angular/core';

import { ActionsService } from 'app/services/actions.service';
import { BrokerService } from 'app/services/broker.service';
import { ControlStyleService } from 'app/services/control-style.service';
import { ControlsService } from 'app/services/controls.service';
import { EventsService } from 'app/services/events.service';
import { FocusService } from 'app/services/focus.service';
import { FontService } from 'app/services/font.service';
import { FormsService } from 'app/services/forms.service';
import { FramesService } from 'app/services/frames.service';
import { ImageService } from 'app/services/image.service';
import { KeyboardService } from 'app/services/keyboard.service';
import { LoginService } from 'app/services/login.service';
import { LogService } from 'app/services/log.service';
import { LocaleService } from 'app/services/locale.service';
import { PlatformService } from 'app/services/platform.service';
import { RoutingService } from 'app/services/routing.service';
import { SerializeService } from 'app/services/serialize.service';
import { TextsService } from 'app/services/texts.service';
import { TitleService } from 'app/services/title.service';

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
    return platformService.isAndroid() ? new MobileStorageService(zone) : new LocalStorageService();
  },
  deps: [PlatformService, NgZone]
};

const formatterServices = [
  DateTimeFormatService,
  NumberFormatService,
  PatternFormatService,
  StringFormatService
];

const services = [
  ActionsService,
  BrokerService,
  ControlStyleService,
  ControlsService,
  EventsService,
  FocusService,
  FontService,
  FormsService,
  FramesService,
  ImageService,
  KeyboardService,
  LocalStorageService,
  LoginService,
  LogService,
  LocaleService,
  PlatformService,
  RoutingService,
  SerializeService,
  TextsService,
  TitleService
];

export const ALL_SERVICES = [
  storageServiceProvider,
  formatterServices,
  services
];

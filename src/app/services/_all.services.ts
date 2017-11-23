import { ActionsService } from 'app/services/actions.service';
import { BrokerService } from 'app/services/broker.service';
import { ControlStyleService } from 'app/services/control-style.service';
import { ControlsService } from 'app/services/controls.service';
import { ErrorService } from 'app/services/error.service';
import { EventsService } from 'app/services/events.service';
import { FocusService } from 'app/services/focus.service';
import { FontService } from 'app/services/font.service';
import { FormsService } from 'app/services/forms.service';
import { ImageService } from 'app/services/image.service';
import { KeyboardService } from 'app/services/keyboard.service';
import { LocalStorageService } from 'app/services/local-storage.service';
import { LoginService } from 'app/services/login.service';
import { LogService } from 'app/services/log.service';
import { LocaleService } from 'app/services/locale.service';
import { NativeService } from 'app/services/native.service';
import { PlatformService } from 'app/services/platform.service';
import { RoutingService } from 'app/services/routing.service';
import { StorageService } from 'app/services/storage.service';
import { TitleService } from 'app/services/title.service';

export const ALL_SERVICES = [
  { provide: StorageService, useClass: LocalStorageService },
  ActionsService,
  BrokerService,
  ControlStyleService,
  ControlsService,
  ErrorService,
  EventsService,
  FocusService,
  FontService,
  FormsService,
  ImageService,
  KeyboardService,
  LoginService,
  LogService,
  LocaleService,
  NativeService,
  PlatformService,
  RoutingService,
  TitleService
];

import { ActionsService } from './actions.service';
import { BrokerService } from './broker.service';
import { ControlStyleService } from './control-style.service';
import { ControlsService } from './controls.service';
import { ErrorService } from './error.service';
import { EventsService } from './events.service';
import { FocusService } from './focus.service';
import { FontService } from './font.service';
import { FormsService } from './forms.service';
import { ImageService } from './image.service';
import { LocalStorageService } from './local-storage.service';
import { LoginService } from './login.service';
import { LogService } from './log.service';
import { LocaleService } from './locale.service';
import { RoutingService } from './routing.service';
import { StorageService } from './storage.service';
import { TitleService } from './title.service';
import { WindowRefService } from './windowref.service';

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
  LoginService,
  LogService,
  LocaleService,
  RoutingService,
  TitleService,
  WindowRefService
];

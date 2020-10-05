import { ActionsService } from '@app/services/actions.service';
import { BarcodeService } from '@app/services/actions/barcode.service';
import { CameraService } from '@app/services/actions/camera.service';
import { GeoLocationService } from '@app/services/actions/geolocation.service';
import { PrintReportService } from '@app/services/actions/print-report.service';
import { ViewDocService } from '@app/services/actions/viewdoc.service';
import { BackService } from '@app/services/back-service';
import { BrokerService } from '@app/services/broker.service';
import { ClientDataService } from '@app/services/client-data.service';
import { ControlStyleService } from '@app/services/control-style.service';
import { ControlsService } from '@app/services/controls.service';
import { DialogService } from '@app/services/dialog.service';
import { EventsService } from '@app/services/events.service';
import { FocusService } from '@app/services/focus.service';
import { FontService } from '@app/services/font.service';
import { BaseFormatService } from '@app/services/formatter/base-format.service';
import { DateTimeFormatService } from '@app/services/formatter/datetime-format.service';
import { NumberFormatService } from '@app/services/formatter/number-format.service';
import { PatternFormatService } from '@app/services/formatter/pattern-format.service';
import { StringFormatService } from '@app/services/formatter/string-format.service';
import { FormsService } from '@app/services/forms.service';
import { FramesService } from '@app/services/frames.service';
import { ImageService } from '@app/services/image.service';
import { KeyboardService } from '@app/services/keyboard.service';
import { LoaderService } from '@app/services/loader.service';
import { LocaleService } from '@app/services/locale.service';
import { LoginService } from '@app/services/login.service';
import { PlatformService } from '@app/services/platform.service';
import { RoutingService } from '@app/services/routing.service';
import { StateService } from '@app/services/state.service';
import { StorageService } from '@app/services/storage.service';
import { TextsService } from '@app/services/texts.service';
import { TitleService } from '@app/services/title.service';

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
  LoginService,
  LocaleService,
  PlatformService,
  PrintReportService,
  RoutingService,
  StateService,
  StorageService,
  TextsService,
  TitleService,
  ViewDocService
];

export const ALL_SERVICES = [
  formatterServices,
  services
];

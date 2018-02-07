import { ErrorBoxComponent } from 'app/components/errorbox/errorbox.component';
import { FrameComponent } from 'app/components/frame/frame.component';
import { LoginComponent } from 'app/components/login/login.component';
import { MsgBoxComponent } from 'app/components/msgbox/msgbox.component';
import { NavbarComponent } from 'app/components/navbar/navbar.component';
import { ViewerComponent } from 'app/components/viewer/viewer.component';

import { ErrorBoxOverlay } from 'app/components/errorbox/errorbox-overlay';
import { MsgBoxOverlay } from 'app/components/msgbox/msgbox-overlay';

export const ALL_COMPONENTS = [
  ErrorBoxComponent,
  FrameComponent,
  LoginComponent,
  MsgBoxComponent,
  NavbarComponent,
  ViewerComponent
];

export const ALL_COMPONENT_SERVICES = [
  ErrorBoxOverlay,
  MsgBoxOverlay
];

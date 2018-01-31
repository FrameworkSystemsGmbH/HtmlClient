import { InjectionToken } from '@angular/core';

import { IMsgBoxMessage } from 'app/services/overlays/msgbox.service';

export const MSGBOX_DATA = new InjectionToken<IMsgBoxMessage>('MSGBOX_DATA');

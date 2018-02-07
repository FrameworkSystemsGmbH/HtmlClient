import { InjectionToken } from '@angular/core';

import { IMsgBoxMessage } from 'app/components/msgbox/msgbox-overlay';

export const MSGBOX_DATA = new InjectionToken<IMsgBoxMessage>('MSGBOX_DATA');

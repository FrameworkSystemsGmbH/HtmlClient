import { InjectionToken } from '@angular/core';

import { IErrorMessage } from 'app/services/overlays/errorbox.service';

export const ERRORBOX_DATA = new InjectionToken<IErrorMessage>('ERRORBOX_DATA');

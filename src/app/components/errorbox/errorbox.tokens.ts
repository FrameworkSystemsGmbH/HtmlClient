import { InjectionToken } from '@angular/core';

import { IErrorMessage } from 'app/components/errorbox/errorbox-overlay';

export const ERRORBOX_DATA = new InjectionToken<IErrorMessage>('ERRORBOX_DATA');

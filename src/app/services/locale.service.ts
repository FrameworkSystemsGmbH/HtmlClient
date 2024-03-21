import { Injectable } from '@angular/core';
import * as Moment from 'moment-timezone';

/**
 * Zuständig für die Timezone
 */
@Injectable({ providedIn: 'root' })
export class LocaleService {

  private readonly _locale: string;
  private readonly _timeZone: string;

  public constructor() {
    const browserTimeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const browserLocale: string = navigator.language;

    this._locale = browserLocale.trim().length > 0 ? browserLocale : 'de-DE';
    this._timeZone = browserTimeZone.trim().length > 0 ? browserTimeZone : 'Europe/Berlin';
  }

  public setMomentLocaleGlobally(): void {
    Moment.locale(this._locale);
    Moment.tz.setDefault(this._timeZone);
  }

  public getLocale(): string {
    return this._locale;
  }
}

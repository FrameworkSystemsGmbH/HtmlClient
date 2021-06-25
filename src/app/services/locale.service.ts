import { Injectable } from '@angular/core';
import * as Moment from 'moment-timezone';

@Injectable({ providedIn: 'root' })
export class LocaleService {

  private readonly _locale: string;
  private readonly _timeZone: string;

  public constructor() {
    const browserTimeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const browserLocale: string = navigator.language;

    this._locale = browserLocale ? browserLocale : 'de-DE';
    this._timeZone = !String.isNullOrWhiteSpace(browserTimeZone) ? browserTimeZone : 'Europe/Berlin';
  }

  public setMomentLocaleGlobally(): void {
    Moment.locale(this._locale);
    Moment.tz.setDefault(this._timeZone);
  }

  public getLocale(): string {
    return this._locale;
  }
}

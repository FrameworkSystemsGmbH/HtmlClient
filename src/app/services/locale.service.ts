import { Injectable } from '@angular/core';
import * as Moment from 'moment-timezone';

@Injectable()
export class LocaleService {

  private locale: string;
  private timeZone: string;

  public constructor() {
    const browserTimeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const browserLocale: string = navigator.language;

    this.locale = browserLocale ? browserLocale : 'de-DE';
    this.timeZone = !String.isNullOrWhiteSpace(browserTimeZone) ? browserTimeZone : 'Europe/Berlin';
  }

  public setMomentLocaleGlobally(): void {
    Moment.locale(this.locale);
    Moment.tz.setDefault(this.timeZone);
  }

  public getLocale(): string {
    return this.locale;
  }
}

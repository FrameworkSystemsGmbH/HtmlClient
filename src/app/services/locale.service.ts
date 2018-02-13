import * as Moment from 'moment-timezone';

export class LocaleService {

  private locale: string;
  private timeZone: string;

  constructor() {
    const browserTimeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const browserLocale: string = navigator.language;

    this.locale = browserLocale ? browserLocale : 'de-DE';
    this.timeZone = !String.isNullOrWhiteSpace(browserTimeZone) ? browserTimeZone : 'Europe/Berlin';
  }

  public setMomentLocaleGlobally() {
    Moment.locale(this.locale);
    Moment.tz.setDefault(this.timeZone);
  }

  public getLocale(): string {
    return this.locale;
  }
}

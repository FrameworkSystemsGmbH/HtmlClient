import * as Moment from 'moment-timezone';

export class LocaleService {

  private locale: string;
  private timeZone: string;

  constructor() {
    const browserTimeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.locale = navigator.language ? navigator.language : 'de-DE';
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

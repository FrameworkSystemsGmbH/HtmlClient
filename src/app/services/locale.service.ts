import * as Moment from 'moment';

export class LocaleService {

  private locale: string;

  constructor() {
    this.locale = navigator.language ? navigator.language : 'de-DE';
    this.setMomentLocaleGlobally();
  }

  private setMomentLocaleGlobally() {
    Moment.locale(this.locale);
  }

  public getLocale(): string {
    return this.locale;
  }
}

import { Injectable } from '@angular/core';
import * as Moment from 'moment';

import { LocaleService } from '.././locale.service';
import { TextFormat } from '../../enums';

@Injectable()
export class DateFormatService {

  public static readonly jsonFormat: string = 'DD.MM.YYYY HH:mm:ss';

  constructor(private localeService: LocaleService) { }

  public momentToJson(value: Moment.Moment): string {
    return value ? value.format(DateFormatService.jsonFormat) : null;
  }

  public momentFromJson(value: string): Moment.Moment {
    return Moment(value, DateFormatService.jsonFormat, true);
  }

  public formatString(value: string, textFormat: TextFormat, formatPattern: string): string {
    return value;
  }

  public formatMoment(value: Moment.Moment, textFormat: TextFormat, formatPattern: string): string {
    return value ? value.format() : null;
  }

  public parseString(value: string, textFormat: TextFormat, formatPattern?: string): Moment.Moment {
    return Moment();
  }
}

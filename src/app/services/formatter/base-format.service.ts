import { Injectable } from '@angular/core';
import { DateTimeFormatService } from 'app/services/formatter/datetime-format.service';
import { NumberFormatService } from 'app/services/formatter/number-format.service';
import { StringFormatService } from 'app/services/formatter/string-format.service';
import { TextFormat } from 'app/enums/text-format';

@Injectable()
export class BaseFormatService {

  constructor(
    private dateTimeFormatService: DateTimeFormatService,
    private numberFormatService: NumberFormatService,
    private stringFormatService: StringFormatService
  ) { }

  public formatString(value: string, format: TextFormat, formatPattern: string): string {
    switch (format) {
      case TextFormat.Decimal:
      case TextFormat.Integer:
      case TextFormat.PositiveInteger:
      case TextFormat.NegativeInteger:
      case TextFormat.UserDefined:
        return this.numberFormatService.formatString(value, format, formatPattern);
      case TextFormat.DateTimeShort:
      case TextFormat.DateTimeMedium:
      case TextFormat.DateTimeLong:
      case TextFormat.DateOnlyShort:
      case TextFormat.DateOnlyMedium:
      case TextFormat.DateOnlyLong:
      case TextFormat.TimeOnlyShort:
      case TextFormat.TimeOnlyMedium:
      case TextFormat.TimeOnlyLong:
        return this.dateTimeFormatService.formatString(value, format, formatPattern);
      default:
        return this.stringFormatService.formatString(value, format);
    }
  }
}

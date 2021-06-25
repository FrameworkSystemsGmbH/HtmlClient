import { Injectable } from '@angular/core';
import { ParseMethod } from '@app/enums/parse-method';
import { TextFormat } from '@app/enums/text-format';
import { DateTimeFormatService } from '@app/services/formatter/datetime-format.service';
import { NumberFormatService } from '@app/services/formatter/number-format.service';
import { StringFormatService } from '@app/services/formatter/string-format.service';

@Injectable()
export class BaseFormatService {

  public constructor(
    private readonly dateTimeFormatService: DateTimeFormatService,
    private readonly numberFormatService: NumberFormatService,
    private readonly stringFormatService: StringFormatService
  ) { }

  public formatString(value: string, parseMethod: ParseMethod, format: TextFormat, formatPattern: string): string {
    switch (format) {
      case TextFormat.Decimal:
      case TextFormat.Integer:
      case TextFormat.PositiveInteger:
      case TextFormat.NegativeInteger:
      case TextFormat.UserDefined:
        return this.numberFormatService.formatString(value, parseMethod, format, formatPattern);
      case TextFormat.DateTimeShort:
      case TextFormat.DateTimeMedium:
      case TextFormat.DateTimeLong:
      case TextFormat.DateOnlyShort:
      case TextFormat.DateOnlyMedium:
      case TextFormat.DateOnlyLong:
      case TextFormat.TimeOnlyShort:
      case TextFormat.TimeOnlyMedium:
      case TextFormat.TimeOnlyLong:
        let val: any = null;
        if (!String.isNullOrWhiteSpace(value)) {
          val = this.dateTimeFormatService.momentFromJson(value);

          if (val === null || !val.isValid()) {
            val = null;
          }
        }
        return this.dateTimeFormatService.formatDate(val, format, formatPattern);
      default:
        return this.stringFormatService.formatString(value, format);
    }
  }
}

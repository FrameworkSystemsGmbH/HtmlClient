import * as Moment from 'moment-timezone';

import { TextFormat } from '../../enums';

export class DateFormatService {

  private static readonly jsonFormat: string = 'DD.MM.YYYY HH:mm:ss';

  private static readonly dateOnlyShortFormat: string = 'L';
  private static readonly dateOnlyMediumFormat: string = 'll';
  private static readonly dateOnlyLongFormat: string = 'LL';

  private static readonly dateTimeShortFormat: string = 'L LT';
  private static readonly dateTimeMediumFormat: string = 'll LT';
  private static readonly dateTimeLongFormat: string = 'LL LT';

  private static readonly timeOnlyShortFormat: string = 'LT';
  private static readonly timeOnlyMediumFormat: string = 'LTS';
  private static readonly timeOnlyLongFormat: string = 'LTS zz';

  private static readonly dtShortcutSeparators: Array<string> = ['.', ',', '+', '-', '/'];

  private static readonly dayMonthYear: string = 'DMY';
  private static readonly monthDayYear: string = 'MDY';
  private static readonly dayYearMonth: string = 'DYM';
  private static readonly monthYearDay: string = 'MYD';
  private static readonly yearDayMonth: string = 'YDM';
  private static readonly yearMonthDay: string = 'YMD';

  private static readonly hourMinSec: string = 'Hms';
  private static readonly hourSecMin: string = 'Hsm';
  private static readonly secHourMin: string = 'sHm';
  private static readonly minHourSec: string = 'mHs';
  private static readonly secMinHour: string = 'smH';
  private static readonly minSecHour: string = 'msH';

  private static readonly onlyDigitRegExp: RegExp = /^\d+$/;

  public momentToJson(value: Moment.Moment): string {
    return value ? value.format(DateFormatService.jsonFormat) : null;
  }

  public momentFromJson(value: string): Moment.Moment {
    return Moment(value, DateFormatService.jsonFormat, true);
  }

  public formatString(value: string, textFormat: TextFormat, formatPattern: string): string {
    if (String.isNullOrWhiteSpace(value)) {
      return null;
    }

    let dateTime: Moment.Moment = this.parseString(value, textFormat, formatPattern);

    return this.formatDate(dateTime, textFormat, formatPattern);
  }

  public formatDate(value: Moment.Moment, textFormat: TextFormat, formatPattern: string): string {
    if (value == null || !value.isValid()) {
      return null;
    }

    if (!String.isNullOrWhiteSpace(formatPattern)) {
      return value.format(formatPattern);
    } else if (textFormat != null) {
      switch (textFormat) {
        case TextFormat.DateOnlyShort:
          return value.format(DateFormatService.dateOnlyShortFormat);
        case TextFormat.DateOnlyMedium:
          return value.format(DateFormatService.dateOnlyMediumFormat);
        case TextFormat.DateOnlyLong:
          return value.format(DateFormatService.dateOnlyLongFormat);
        case TextFormat.TimeOnlyShort:
          return value.format(DateFormatService.timeOnlyShortFormat);
        case TextFormat.TimeOnlyMedium:
          return value.format(DateFormatService.timeOnlyMediumFormat);
        case TextFormat.TimeOnlyLong:
          return value.format(DateFormatService.timeOnlyLongFormat);
        case TextFormat.DateTimeShort:
          return value.format(DateFormatService.dateTimeShortFormat);
        case TextFormat.DateTimeMedium:
          return value.format(DateFormatService.dateTimeMediumFormat);
        case TextFormat.DateTimeLong:
          return value.format(DateFormatService.dateTimeLongFormat);
      }
    }

    return null;
  }

  public parseString(value: string, textFormat: TextFormat, formatPattern: string): Moment.Moment {
    if (String.isNullOrWhiteSpace(value)) {
      return null;
    }

    let dateTime: Moment.Moment = null;

    dateTime = this.parseMomentFromFormatPattern(value, formatPattern);
    if (dateTime == null) {
      dateTime = this.parseMomentFromTextFormat(value, textFormat);
      if (dateTime == null) {
        dateTime = this.parseMomentFromShortcut(value, textFormat, formatPattern);
      }
    }

    return dateTime;
  }

  private parseMomentFromFormatPattern(value: string, formatPattern: string): Moment.Moment {
    if (String.isNullOrWhiteSpace(value) || String.isNullOrWhiteSpace(formatPattern)) {
      return null;
    }

    let dateTime: Moment.Moment = Moment(value, formatPattern);

    if (dateTime == null || !dateTime.isValid()) {
      return null;
    }

    return dateTime;
  }

  private parseMomentFromTextFormat(value: string, textFormat: TextFormat): Moment.Moment {
    if (String.isNullOrWhiteSpace(value) || textFormat == null) {
      return null;
    }

    let dateTime: Moment.Moment = null;

    switch (textFormat) {
      case TextFormat.DateOnlyShort:
        dateTime = Moment(value, DateFormatService.dateOnlyShortFormat);
        break;
      case TextFormat.DateOnlyMedium:
        dateTime = Moment(value, DateFormatService.dateOnlyMediumFormat);
        break;
      case TextFormat.DateOnlyLong:
        dateTime = Moment(value, DateFormatService.dateOnlyLongFormat);
        break;
      case TextFormat.TimeOnlyShort:
        dateTime = Moment(value, DateFormatService.timeOnlyShortFormat);
        break;
      case TextFormat.TimeOnlyMedium:
        dateTime = Moment(value, DateFormatService.timeOnlyMediumFormat);
        break;
      case TextFormat.TimeOnlyLong:
        dateTime = Moment(value, DateFormatService.timeOnlyLongFormat);
        break;
      case TextFormat.DateTimeShort:
        dateTime = Moment(value, DateFormatService.dateTimeShortFormat);
        break;
      case TextFormat.DateTimeMedium:
        dateTime = Moment(value, DateFormatService.dateTimeMediumFormat);
        break;
      case TextFormat.DateTimeLong:
        dateTime = Moment(value, DateFormatService.dateTimeLongFormat);
        break;
    }

    if (dateTime == null || !dateTime.isValid()) {
      return null;
    }

    return dateTime;
  }

  private parseMomentFromShortcut(value: string, textFormat: TextFormat, formatPattern): Moment.Moment {
    let dateTime: Moment.Moment = null;

    switch (textFormat) {
      case TextFormat.DateOnlyShort:
      case TextFormat.DateOnlyMedium:
      case TextFormat.DateOnlyLong:
        dateTime = this.getDateFromShortcut(value, formatPattern);
        break;
      case TextFormat.TimeOnlyShort:
      case TextFormat.TimeOnlyMedium:
      case TextFormat.TimeOnlyLong:
        dateTime = this.getTimeFromShortcut(value, formatPattern);
        break;
      case TextFormat.DateTimeShort:
      case TextFormat.DateTimeMedium:
      case TextFormat.DateTimeLong:
        dateTime = this.getDateTimeFromShortcut(value, formatPattern);
        break;
    }

    if (dateTime == null || !dateTime.isValid()) {
      return null;
    }

    return dateTime;
  }

  /*
  * Can process the following date patterns depending on the format pattern or locale backup:
  *
  * DMY:        MDY:        DYM:        MYD:        YDM:        YMD:
  *
  * D           D           D           D           D           D
  * DD          DD          DD          DD          DD          DD
  * DDMM        MMDD        DDMM        MMDD        DDMM        MMDD
  * DDMMYY      MMDDYY      DDYYMM      MMYYDD      YYDDMM      YYMMDD
  * DDMMYYYY    MMDDYYYY    DDYYYYMM    MMYYYYDD    YYYYDDMM    YYYYMMDD
  */
  private getDateFromShortcut(value: string, formatPattern: string): Moment.Moment {
    if (String.isNullOrWhiteSpace(value)) {
      return null;
    }

    if (value.startsWith('*')) {
      return this.getDateFromSpecialChar(value);
    }

    let length: number = value.length;

    if (length > 8 || length === 7 || length === 5 || length === 3 || !DateFormatService.onlyDigitRegExp.test(value)) {
      return null;
    }

    let formatOrder: string = this.getDateFormatOrderFromPattern(formatPattern);

    let date: Moment.Moment = null;

    if (formatOrder === DateFormatService.dayMonthYear) {
      if (length === 8) {
        date = Moment(value, 'DDMMYYYY');
      } else if (length === 6) {
        date = Moment(value, 'DDMMYY');
      } else if (length === 4) {
        date = Moment(value, 'DDMM');
      } else if (length === 2) {
        date = Moment(value, 'DD');
      } else {
        date = Moment(value, 'D');
      }
    } else if (formatOrder === DateFormatService.monthDayYear) {
      if (length === 8) {
        date = Moment(value, 'MMDDYYYY');
      } else if (length === 6) {
        date = Moment(value, 'MMDDYY');
      } else if (length === 4) {
        date = Moment(value, 'MMDD');
      } else if (length === 2) {
        date = Moment(value, 'DD');
      } else {
        date = Moment(value, 'D');
      }
    } else if (formatOrder === DateFormatService.dayYearMonth) {
      if (length === 8) {
        date = Moment(value, 'DDYYYYMM');
      } else if (length === 6) {
        date = Moment(value, 'DDYYMM');
      } else if (length === 4) {
        date = Moment(value, 'DDMM');
      } else if (length === 2) {
        date = Moment(value, 'DD');
      } else {
        date = Moment(value, 'D');
      }
    } else if (formatOrder === DateFormatService.monthYearDay) {
      if (length === 8) {
        date = Moment(value, 'MMYYYYDD');
      } else if (length === 6) {
        date = Moment(value, 'MMYYDD');
      } else if (length === 4) {
        date = Moment(value, 'MMDD');
      } else if (length === 2) {
        date = Moment(value, 'DD');
      } else {
        date = Moment(value, 'D');
      }
    } else if (formatOrder === DateFormatService.yearDayMonth) {
      if (length === 8) {
        date = Moment(value, 'YYYYDDMM');
      } else if (length === 6) {
        date = Moment(value, 'YYDDMM');
      } else if (length === 4) {
        date = Moment(value, 'DDMM');
      } else if (length === 2) {
        date = Moment(value, 'DD');
      } else {
        date = Moment(value, 'D');
      }
    } else if (formatOrder === DateFormatService.yearMonthDay) {
      if (length === 8) {
        date = Moment(value, 'YYYYMMDD');
      } else if (length === 6) {
        date = Moment(value, 'YYMMDD');
      } else if (length === 4) {
        date = Moment(value, 'MMDD');
      } else if (length === 2) {
        date = Moment(value, 'DD');
      } else {
        date = Moment(value, 'D');
      }
    }

    if (date == null || !date.isValid()) {
      return null;
    }

    return date;
  }

  /*
  * Can process the following time patterns depending on the format pattern or locale backup:
  *
  * Hms         Hsm         mHs         sHm         msH         smH
  *
  * H           H           H           H           H           H
  * HH          HH          HH          HH          HH          HH
  * Hmm         Hmm         mmH         Hmm         mmH         mmH
  * HHmm        HHmm        mmHH        HHmm        mmHH        mmHH
  * Hmmss       Hssmm       mmHss       ssHmm       mmssH       ssmmH
  * HHmmss      HHssmm      mmHHss      ssHHmm      mmssHH      ssmmHH
  */
  private getTimeFromShortcut(value: string, formatPattern: string): Moment.Moment {
    if (String.isNullOrWhiteSpace(value)) {
      return null;
    }

    if (value.startsWith('*')) {
      return this.getTimeFromSpecialChar(value);
    }

    let length: number = value.length;

    if (length > 6 || !DateFormatService.onlyDigitRegExp.test(value)) {
      return null;
    }

    let formatOrder: string = this.getTimeFormatOrderFromPattern(formatPattern);

    let time: Moment.Moment = null;

    if (formatOrder === DateFormatService.hourMinSec) {
      if (length === 6) {
        time = Moment(value, 'HHmmss');
      } else if (length === 5) {
        time = Moment(value, 'Hmmss');
      } else if (length === 4) {
        time = Moment(value, 'HHmm');
      } else if (length === 3) {
        time = Moment(value, 'Hmm');
      } else if (length === 2) {
        time = Moment(value, 'HH');
      } else {
        time = Moment(value, 'H');
      }
    } else if (formatOrder === DateFormatService.hourSecMin) {
      if (length === 6) {
        time = Moment(value, 'HHssmm');
      } else if (length === 5) {
        time = Moment(value, 'Hssmm');
      } else if (length === 4) {
        time = Moment(value, 'HHmm');
      } else if (length === 3) {
        time = Moment(value, 'Hmm');
      } else if (length === 2) {
        time = Moment(value, 'HH');
      } else {
        time = Moment(value, 'H');
      }
    } else if (formatOrder === DateFormatService.minHourSec) {
      if (length === 6) {
        time = Moment(value, 'mmHHss');
      } else if (length === 5) {
        time = Moment(value, 'mmHss');
      } else if (length === 4) {
        time = Moment(value, 'mmHH');
      } else if (length === 3) {
        time = Moment(value, 'mmH');
      } else if (length === 2) {
        time = Moment(value, 'HH');
      } else {
        time = Moment(value, 'H');
      }
    } else if (formatOrder === DateFormatService.secHourMin) {
      if (length === 6) {
        time = Moment(value, 'ssHHmm');
      } else if (length === 5) {
        time = Moment(value, 'ssHmm');
      } else if (length === 4) {
        time = Moment(value, 'HHmm');
      } else if (length === 3) {
        time = Moment(value, 'Hmm');
      } else if (length === 2) {
        time = Moment(value, 'HH');
      } else {
        time = Moment(value, 'H');
      }
    } else if (formatOrder === DateFormatService.minSecHour) {
      if (length === 6) {
        time = Moment(value, 'mmssHH');
      } else if (length === 5) {
        time = Moment(value, 'mmssH');
      } else if (length === 4) {
        time = Moment(value, 'mmHH');
      } else if (length === 3) {
        time = Moment(value, 'mmH');
      } else if (length === 2) {
        time = Moment(value, 'HH');
      } else {
        time = Moment(value, 'H');
      }
    } else if (formatOrder === DateFormatService.secMinHour) {
      if (length === 6) {
        time = Moment(value, 'ssmmHH');
      } else if (length === 5) {
        time = Moment(value, 'ssmmH');
      } else if (length === 4) {
        time = Moment(value, 'mmHH');
      } else if (length === 3) {
        time = Moment(value, 'mmH');
      } else if (length === 2) {
        time = Moment(value, 'HH');
      } else {
        time = Moment(value, 'H');
      }
    }

    if (time == null || !time.isValid()) {
      return null;
    }

    return time;
  }

  /*
  * Can process the following date + time patterns:
  * [datepart]                        Example: DDMMYY
  * [separator][timepart]             Example: /HHmm
  * [datepart][separator][timepart]   Example: DDMMYY/HHmm
  */
  private getDateTimeFromShortcut(value: string, formatPattern: string): Moment.Moment {
    if (String.isNullOrWhiteSpace(value)) {
      return null;
    }

    let separatorPos: number = Number.MAX_SAFE_INTEGER;

    for (let separator of DateFormatService.dtShortcutSeparators) {
      let pos: number = value.indexOf(separator);
      if (pos >= 0) {
        separatorPos = Math.min(separatorPos, pos);
      }
    }

    let dateTime: Moment.Moment = null;

    if (separatorPos < Number.MAX_SAFE_INTEGER) {
      if (separatorPos === 0) {
        let timePart: string = value.substring(1);
        if (!String.isNullOrWhiteSpace(timePart)) {
          dateTime = this.getTimeFromShortcut(timePart, formatPattern);
        }
      } else if (separatorPos === value.length - 1) {
        let datePart: string = value.substring(0, value.length - 1);
        if (!String.isNullOrWhiteSpace(datePart)) {
          dateTime = this.getDateFromShortcut(datePart, formatPattern);
        }
      } else {
        let datePart: string = value.substring(0, separatorPos);
        let timePart: string = value.substring(separatorPos + 1);

        let date: Moment.Moment = this.getDateFromShortcut(datePart, formatPattern);
        let time: Moment.Moment = this.getTimeFromShortcut(timePart, formatPattern);

        let dateValid: boolean = date != null && date.isValid();
        let timeValid: boolean = time != null && time.isValid();

        if (!dateValid || !timeValid) {
          return null;
        }

        date.hours(time.hours());
        date.minutes(time.minutes());
        date.seconds(time.seconds());

        dateTime = date;
      }
    } else {
      dateTime = this.getDateFromShortcut(value, formatPattern);
    }

    if (dateTime == null || !dateTime.isValid()) {
      return null;
    }

    return dateTime;
  }

  private getDateFormatOrderFromPattern(formatPattern: string): string {
    let pattern: string = formatPattern;

    if (String.isNullOrWhiteSpace(pattern)) {
      pattern = Moment.localeData().longDateFormat('L');

      if (String.isNullOrWhiteSpace(pattern)) {
        return DateFormatService.dayMonthYear;
      }
    }

    let shortPattern: string = String.empty();

    for (let char of pattern) {
      if ((char === 'D' || char === 'M' || char === 'Y') && shortPattern.indexOf(char) === -1) {
        shortPattern += char;
      }
    }

    return shortPattern.length === 3 ? shortPattern : DateFormatService.dayMonthYear;
  }

  private getTimeFormatOrderFromPattern(formatPattern: string): string {
    let pattern: string = formatPattern;

    if (String.isNullOrWhiteSpace(pattern)) {
      pattern = Moment.localeData().longDateFormat('LTS');

      if (String.isNullOrWhiteSpace(pattern)) {
        return DateFormatService.hourMinSec;
      }
    }

    let shortPattern: string = String.empty();

    for (let char of pattern) {
      if ((char === 'H' || char === 'm' || char === 's') && shortPattern.indexOf(char) === -1) {
        shortPattern += char;
      }
    }

    return shortPattern.length === 3 ? shortPattern : DateFormatService.hourMinSec;
  }

  private getDateFromSpecialChar(value: string): Moment.Moment {
    if (!value.startsWith('*')) {
      return null;
    }

    let date: Moment.Moment = Moment();

    if (value.startsWith('*+++')) {
      let amount: number = this.getAmoutToAdd(value.substring(4));
      if (amount != null) {
        date.add(amount, 'years');
      }
    } else if (value.startsWith('*++')) {
      let amount: number = this.getAmoutToAdd(value.substring(3));
      if (amount != null) {
        date.add(amount, 'months');
      }
    } else if (value.startsWith('*+')) {
      let amount: number = this.getAmoutToAdd(value.substring(2));
      if (amount != null) {
        date.add(amount, 'days');
      }
    }

    return date;
  }

  private getTimeFromSpecialChar(value: string): Moment.Moment {
    if (!value.startsWith('*')) {
      return null;
    }

    let time: Moment.Moment = Moment();

    if (value.startsWith('*+++')) {
      let amount: number = this.getAmoutToAdd(value.substring(4));
      if (amount != null) {
        time.add(amount, 'hours');
      }
    } else if (value.startsWith('*++')) {
      let amount: number = this.getAmoutToAdd(value.substring(3));
      if (amount != null) {
        time.add(amount, 'minutes');
      }
    } else if (value.startsWith('*+')) {
      let amount: number = this.getAmoutToAdd(value.substring(2));
      if (amount != null) {
        time.add(amount, 'seconds');
      }
    }

    return time;
  }

  private getAmoutToAdd(value: string): number {
    if (String.isNullOrWhiteSpace(value) || !DateFormatService.onlyDigitRegExp.test(value)) {
      return null;
    }

    return Number(value);
  }
}

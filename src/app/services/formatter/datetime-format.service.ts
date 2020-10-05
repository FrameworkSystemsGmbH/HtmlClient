import { Injectable } from '@angular/core';

import * as Moment from 'moment-timezone';

import { TextFormat } from '@app/enums/text-format';

@Injectable()
export class DateTimeFormatService {

  private readonly jsonFormat: string = 'DD.MM.YYYY HH:mm:ss';

  private readonly dateOnlyShortFormat: string = 'L';
  private readonly dateOnlyMediumFormat: string = 'll';
  private readonly dateOnlyLongFormat: string = 'LL';

  private readonly dateTimeShortFormat: string = 'L LT';
  private readonly dateTimeMediumFormat: string = 'll LT';
  private readonly dateTimeLongFormat: string = 'LL LT';

  private readonly timeOnlyShortFormat: string = 'LT';
  private readonly timeOnlyMediumFormat: string = 'LTS';
  private readonly timeOnlyLongFormat: string = 'LTS zz';

  private readonly dtShortcutSeparators: Array<string> = ['.', ',', '+', '-', '/'];

  private readonly dayMonthYear: string = 'DMY';
  private readonly monthDayYear: string = 'MDY';
  private readonly dayYearMonth: string = 'DYM';
  private readonly monthYearDay: string = 'MYD';
  private readonly yearDayMonth: string = 'YDM';
  private readonly yearMonthDay: string = 'YMD';

  private readonly hourMinSec: string = 'Hms';
  private readonly hourSecMin: string = 'Hsm';
  private readonly secHourMin: string = 'sHm';
  private readonly minHourSec: string = 'mHs';
  private readonly secMinHour: string = 'smH';
  private readonly minSecHour: string = 'msH';

  private readonly onlyDigitRegExp: RegExp = /^\d+$/;

  public momentToJson(value: Moment.Moment): string {
    return value ? value.format(this.jsonFormat) : null;
  }

  public momentFromJson(value: string): Moment.Moment {
    return Moment(value, this.jsonFormat, true);
  }

  public formatString(value: string, textFormat: TextFormat, formatPattern: string): string {
    if (String.isNullOrWhiteSpace(value)) {
      return null;
    }

    const dateTime: Moment.Moment = this.parseString(value, textFormat, formatPattern);

    if (dateTime == null || !dateTime.isValid()) {
      return null;
    }

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
          return value.format(this.dateOnlyShortFormat);
        case TextFormat.DateOnlyMedium:
          return value.format(this.dateOnlyMediumFormat);
        case TextFormat.DateOnlyLong:
          return value.format(this.dateOnlyLongFormat);
        case TextFormat.TimeOnlyShort:
          return value.format(this.timeOnlyShortFormat);
        case TextFormat.TimeOnlyMedium:
          return value.format(this.timeOnlyMediumFormat);
        case TextFormat.TimeOnlyLong:
          return value.format(this.timeOnlyLongFormat);
        case TextFormat.DateTimeShort:
          return value.format(this.dateTimeShortFormat);
        case TextFormat.DateTimeMedium:
          return value.format(this.dateTimeMediumFormat);
        case TextFormat.DateTimeLong:
          return value.format(this.dateTimeLongFormat);
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

    const dateTime: Moment.Moment = Moment(value, formatPattern, true);

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
        dateTime = Moment(value, this.dateOnlyShortFormat, true);
        break;
      case TextFormat.DateOnlyMedium:
        dateTime = Moment(value, this.dateOnlyMediumFormat, true);
        break;
      case TextFormat.DateOnlyLong:
        dateTime = Moment(value, this.dateOnlyLongFormat, true);
        break;
      case TextFormat.TimeOnlyShort:
        dateTime = Moment(value, this.timeOnlyShortFormat, true);
        break;
      case TextFormat.TimeOnlyMedium:
        dateTime = Moment(value, this.timeOnlyMediumFormat, true);
        break;
      case TextFormat.TimeOnlyLong:
        dateTime = Moment(value, this.timeOnlyLongFormat, true);
        break;
      case TextFormat.DateTimeShort:
        dateTime = Moment(value, this.dateTimeShortFormat, true);
        break;
      case TextFormat.DateTimeMedium:
        dateTime = Moment(value, this.dateTimeMediumFormat, true);
        break;
      case TextFormat.DateTimeLong:
        dateTime = Moment(value, this.dateTimeLongFormat, true);
        break;
    }

    if (dateTime == null || !dateTime.isValid()) {
      return null;
    }

    return dateTime;
  }

  private parseMomentFromShortcut(value: string, textFormat: TextFormat, formatPattern: string): Moment.Moment {
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

    const length: number = value.length;

    if (length > 8 || length === 7 || length === 5 || length === 3 || !this.onlyDigitRegExp.test(value)) {
      return null;
    }

    const formatOrder: string = this.getDateFormatOrderFromPattern(formatPattern);

    let date: Moment.Moment = null;

    if (length === 1) {
      date = Moment(value, 'D');
    } else if (length === 2) {
      date = Moment(value, 'DD');
    } else {
      switch (formatOrder) {
        case this.dayMonthYear:
          if (length === 4) {
            date = Moment(value, 'DDMM');
          } else if (length === 6) {
            date = Moment(value, 'DDMMYY');
          } else if (length === 8) {
            date = Moment(value, 'DDMMYYYY');
          }
          break;
        case this.monthDayYear:
          if (length === 4) {
            date = Moment(value, 'MMDD');
          } else if (length === 6) {
            date = Moment(value, 'MMDDYY');
          } else if (length === 8) {
            date = Moment(value, 'MMDDYYYY');
          }
          break;
        case this.dayYearMonth:
          if (length === 4) {
            date = Moment(value, 'DDMM');
          } else if (length === 6) {
            date = Moment(value, 'DDYYMM');
          } else if (length === 8) {
            date = Moment(value, 'DDYYYYMM');
          }
          break;
        case this.monthYearDay:
          if (length === 4) {
            date = Moment(value, 'MMDD');
          } else if (length === 6) {
            date = Moment(value, 'MMYYDD');
          } else if (length === 8) {
            date = Moment(value, 'MMYYYYDD');
          }
          break;
        case this.yearDayMonth:
          if (length === 4) {
            date = Moment(value, 'DDMM');
          } else if (length === 6) {
            date = Moment(value, 'YYDDMM');
          } else if (length === 8) {
            date = Moment(value, 'YYYYDDMM');
          }
          break;
        case this.yearMonthDay:
          if (length === 4) {
            date = Moment(value, 'MMDD');
          } else if (length === 6) {
            date = Moment(value, 'YYMMDD');
          } else if (length === 8) {
            date = Moment(value, 'YYYYMMDD');
          }
          break;
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

    const length: number = value.length;

    if (length > 6 || !this.onlyDigitRegExp.test(value)) {
      return null;
    }

    const formatOrder: string = this.getTimeFormatOrderFromPattern(formatPattern);

    let time: Moment.Moment = null;

    if (length === 1) {
      time = Moment(value, 'H');
    } else if (length === 2) {
      time = Moment(value, 'HH');
    } else {
      switch (formatOrder) {
        case this.hourMinSec:
          if (length === 3) {
            time = Moment(value, 'Hmm');
          } else if (length === 4) {
            time = Moment(value, 'HHmm');
          } else if (length === 5) {
            time = Moment(value, 'Hmmss');
          } else if (length === 6) {
            time = Moment(value, 'HHmmss');
          }
          break;
        case this.hourSecMin:
          if (length === 3) {
            time = Moment(value, 'Hmm');
          } else if (length === 4) {
            time = Moment(value, 'HHmm');
          } else if (length === 5) {
            time = Moment(value, 'Hssmm');
          } else if (length === 6) {
            time = Moment(value, 'HHssmm');
          }
          break;
        case this.minHourSec:
          if (length === 3) {
            time = Moment(value, 'mmH');
          } else if (length === 4) {
            time = Moment(value, 'mmHH');
          } else if (length === 5) {
            time = Moment(value, 'mmHss');
          } else if (length === 6) {
            time = Moment(value, 'mmHHss');
          }
          break;
        case this.secHourMin:
          if (length === 3) {
            time = Moment(value, 'Hmm');
          } else if (length === 4) {
            time = Moment(value, 'HHmm');
          } else if (length === 5) {
            time = Moment(value, 'ssHmm');
          } else if (length === 6) {
            time = Moment(value, 'ssHHmm');
          }
          break;
        case this.minSecHour:
          if (length === 3) {
            time = Moment(value, 'mmH');
          } else if (length === 4) {
            time = Moment(value, 'mmHH');
          } else if (length === 5) {
            time = Moment(value, 'mmssH');
          } else if (length === 6) {
            time = Moment(value, 'mmssHH');
          }
          break;
        case this.secMinHour:
          if (length === 3) {
            time = Moment(value, 'mmH');
          } else if (length === 4) {
            time = Moment(value, 'mmHH');
          } else if (length === 5) {
            time = Moment(value, 'ssmmH');
          } else if (length === 6) {
            time = Moment(value, 'ssmmHH');
          }
          break;
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
  * [datepart][separator]             Example: DDMM/
  * [datepart][separator][timepart]   Example: DDMMYY/HHmm
  */
  private getDateTimeFromShortcut(value: string, formatPattern: string): Moment.Moment {
    if (String.isNullOrWhiteSpace(value)) {
      return null;
    }

    let separatorPos: number = null;

    for (let i = 0; i < value.length; i++) {
      const char: string = value.charAt(i);
      if (this.dtShortcutSeparators.indexOf(char) >= 0) {
        if (separatorPos == null) {
          separatorPos = i;
        } else {
          // If more than one separator is found the shortcut is invalid
          return null;
        }
      }
    }

    let dateTime: Moment.Moment = null;

    if (separatorPos != null) {
      if (separatorPos === 0) {
        const timePart: string = value.substring(1);
        if (!String.isNullOrWhiteSpace(timePart)) {
          dateTime = this.getTimeFromShortcut(timePart, formatPattern);
        }
      } else if (separatorPos === value.length - 1) {
        const datePart: string = value.substring(0, value.length - 1);
        if (!String.isNullOrWhiteSpace(datePart)) {
          dateTime = this.getDateFromShortcut(datePart, formatPattern);
        }
      } else {
        const datePart: string = value.substring(0, separatorPos);
        const timePart: string = value.substring(separatorPos + 1);

        const date: Moment.Moment = this.getDateFromShortcut(datePart, formatPattern);
        const time: Moment.Moment = this.getTimeFromShortcut(timePart, formatPattern);

        const dateValid: boolean = date != null && date.isValid();
        const timeValid: boolean = time != null && time.isValid();

        if (!dateValid || !timeValid) {
          return null;
        }

        date.hours(time.hours());
        date.minutes(time.minutes());
        date.seconds(time.seconds());

        return date;
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
    const patternValid: (str: string) => boolean = pattern => !String.isNullOrWhiteSpace(pattern) && pattern.length === 3;

    let shortPattern: string = this.getShortDatePattern(formatPattern);

    if (!patternValid(shortPattern)) {
      shortPattern = this.getShortDatePattern(Moment.localeData().longDateFormat('L'));
      if (!patternValid(shortPattern)) {
        shortPattern = this.dayMonthYear;
      }
    }

    return shortPattern;
  }

  private getShortDatePattern(formatPattern: string): string {
    if (String.isNullOrWhiteSpace(formatPattern)) {
      return null;
    }

    let shortPattern: string = String.empty();

    for (const char of formatPattern) {
      if ((char === 'D' || char === 'M' || char === 'Y') && shortPattern.indexOf(char) === -1) {
        shortPattern += char;
      }
    }

    return shortPattern;
  }

  private getTimeFormatOrderFromPattern(formatPattern: string): string {
    const patternValid: (str: string) => boolean = pattern => !String.isNullOrWhiteSpace(pattern) && pattern.length === 3;

    let shortPattern: string = this.getShortTimePattern(formatPattern);

    if (!patternValid(shortPattern)) {
      shortPattern = this.getShortTimePattern(Moment.localeData().longDateFormat('LTS'));
      if (!patternValid(shortPattern)) {
        shortPattern = this.hourMinSec;
      }
    }

    return shortPattern;
  }

  private getShortTimePattern(formatPattern: string): string {
    if (String.isNullOrWhiteSpace(formatPattern)) {
      return null;
    }

    const hourChar: string = formatPattern.indexOf('H') >= 0 ? 'H' : 'h';

    let shortPattern: string = String.empty();

    for (const char of formatPattern) {
      if ((char === hourChar || char === 'm' || char === 's') && shortPattern.indexOf(char) === -1) {
        shortPattern += (char === hourChar ? char.toUpperCase() : char);
      }
    }

    return shortPattern;
  }

  private getDateFromSpecialChar(value: string): Moment.Moment {
    if (String.isNullOrWhiteSpace(value) || !value.startsWith('*')) {
      return null;
    }

    const date: Moment.Moment = Moment();

    if (value.startsWith('*+++')) {
      const amount: number = this.getAmoutToAdd(value.substring(4));
      if (amount != null) {
        date.add(amount, 'years');
      }
    } else if (value.startsWith('*++')) {
      const amount: number = this.getAmoutToAdd(value.substring(3));
      if (amount != null) {
        date.add(amount, 'months');
      }
    } else if (value.startsWith('*+')) {
      const amount: number = this.getAmoutToAdd(value.substring(2));
      if (amount != null) {
        date.add(amount, 'days');
      }
    } else if (value.startsWith('*---')) {
      const amount: number = this.getAmoutToAdd(value.substring(4));
      if (amount != null) {
        date.subtract(amount, 'years');
      }
    } else if (value.startsWith('*--')) {
      const amount: number = this.getAmoutToAdd(value.substring(3));
      if (amount != null) {
        date.subtract(amount, 'months');
      }
    } else if (value.startsWith('*-')) {
      const amount: number = this.getAmoutToAdd(value.substring(2));
      if (amount != null) {
        date.subtract(amount, 'days');
      }
    }

    return date;
  }

  private getTimeFromSpecialChar(value: string): Moment.Moment {
    if (!value.startsWith('*')) {
      return null;
    }

    const time: Moment.Moment = Moment();

    if (value.startsWith('*+++')) {
      const amount: number = this.getAmoutToAdd(value.substring(4));
      if (amount != null) {
        time.add(amount, 'hours');
      }
    } else if (value.startsWith('*++')) {
      const amount: number = this.getAmoutToAdd(value.substring(3));
      if (amount != null) {
        time.add(amount, 'minutes');
      }
    } else if (value.startsWith('*+')) {
      const amount: number = this.getAmoutToAdd(value.substring(2));
      if (amount != null) {
        time.add(amount, 'seconds');
      }
    } else if (value.startsWith('*---')) {
      const amount: number = this.getAmoutToAdd(value.substring(4));
      if (amount != null) {
        time.subtract(amount, 'hours');
      }
    } else if (value.startsWith('*--')) {
      const amount: number = this.getAmoutToAdd(value.substring(3));
      if (amount != null) {
        time.subtract(amount, 'minutes');
      }
    } else if (value.startsWith('*-')) {
      const amount: number = this.getAmoutToAdd(value.substring(2));
      if (amount != null) {
        time.subtract(amount, 'seconds');
      }
    }

    return time;
  }

  private getAmoutToAdd(value: string): number {
    if (String.isNullOrWhiteSpace(value) || !this.onlyDigitRegExp.test(value)) {
      return null;
    }

    return Number(value);
  }
}

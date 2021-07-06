import { Injectable } from '@angular/core';
import { TextFormat } from '@app/enums/text-format';
import * as Moment from 'moment-timezone';

@Injectable({ providedIn: 'root' })
export class DateTimeFormatService {

  private readonly _jsonFormat: string = 'DD.MM.YYYY HH:mm:ss';

  private readonly _dateOnlyShortFormat: string = 'L';
  private readonly _dateOnlyMediumFormat: string = 'll';
  private readonly _dateOnlyLongFormat: string = 'LL';

  private readonly _dateTimeShortFormat: string = 'L LT';
  private readonly _dateTimeMediumFormat: string = 'll LT';
  private readonly _dateTimeLongFormat: string = 'LL LT';

  private readonly _timeOnlyShortFormat: string = 'LT';
  private readonly _timeOnlyMediumFormat: string = 'LTS';
  private readonly _timeOnlyLongFormat: string = 'LTS zz';

  private readonly _dtShortcutSeparators: Array<string> = ['.', ',', '+', '-', '/'];

  private readonly _dayMonthYear: string = 'DMY';
  private readonly _monthDayYear: string = 'MDY';
  private readonly _dayYearMonth: string = 'DYM';
  private readonly _monthYearDay: string = 'MYD';
  private readonly _yearDayMonth: string = 'YDM';
  private readonly _yearMonthDay: string = 'YMD';

  private readonly _hourMinSec: string = 'Hms';
  private readonly _hourSecMin: string = 'Hsm';
  private readonly _secHourMin: string = 'sHm';
  private readonly _minHourSec: string = 'mHs';
  private readonly _secMinHour: string = 'smH';
  private readonly _minSecHour: string = 'msH';

  private readonly _onlyDigitRegExp: RegExp = /^\d+$/;

  public momentToJson(value: Moment.Moment): string | null {
    return value.isValid() ? value.format(this._jsonFormat) : null;
  }

  public momentFromJson(value: string): Moment.Moment {
    return Moment(value, this._jsonFormat, true);
  }

  public formatString(value: string, textFormat: TextFormat, formatPattern: string | null): string | null {
    if (value.trim().length === 0) {
      return null;
    }

    const dateTime: Moment.Moment | null = this.parseString(value, textFormat, formatPattern);

    if (dateTime == null || !dateTime.isValid()) {
      return null;
    }

    return this.formatDate(dateTime, textFormat, formatPattern);
  }

  public formatDate(value: Moment.Moment, textFormat: TextFormat, formatPattern: string | null): string | null {
    if (!value.isValid()) {
      return null;
    }

    if (formatPattern != null && formatPattern.trim().length > 0) {
      return value.format(formatPattern);
    } else if (textFormat === TextFormat.DateOnlyShort) {
      return value.format(this._dateOnlyShortFormat);
    } else if (textFormat === TextFormat.DateOnlyMedium) {
      return value.format(this._dateOnlyMediumFormat);
    } else if (textFormat === TextFormat.DateOnlyLong) {
      return value.format(this._dateOnlyLongFormat);
    } else if (textFormat === TextFormat.TimeOnlyShort) {
      return value.format(this._timeOnlyShortFormat);
    } else if (textFormat === TextFormat.TimeOnlyMedium) {
      return value.format(this._timeOnlyMediumFormat);
    } else if (textFormat === TextFormat.TimeOnlyLong) {
      return value.format(this._timeOnlyLongFormat);
    } else if (textFormat === TextFormat.DateTimeShort) {
      return value.format(this._dateTimeShortFormat);
    } else if (textFormat === TextFormat.DateTimeMedium) {
      return value.format(this._dateTimeMediumFormat);
    } else if (textFormat === TextFormat.DateTimeLong) {
      return value.format(this._dateTimeLongFormat);
    }

    return null;
  }

  public parseString(value: string, textFormat: TextFormat, formatPattern: string | null): Moment.Moment | null {
    if (value.trim().length === 0) {
      return null;
    }

    let dateTime: Moment.Moment | null = null;

    dateTime = this.parseMomentFromFormatPattern(value, formatPattern);
    if (dateTime == null) {
      dateTime = this.parseMomentFromTextFormat(value, textFormat);
      if (dateTime == null) {
        dateTime = this.parseMomentFromShortcut(value, textFormat, formatPattern);
      }
    }

    return dateTime;
  }

  private parseMomentFromFormatPattern(value: string, formatPattern: string | null): Moment.Moment | null {
    if (value.trim().length === 0 || formatPattern == null || formatPattern.trim().length === 0) {
      return null;
    }

    const dateTime: Moment.Moment = Moment(value, formatPattern, true);

    if (!dateTime.isValid()) {
      return null;
    }

    return dateTime;
  }

  private parseMomentFromTextFormat(value: string, textFormat: TextFormat): Moment.Moment | null {
    if (value.trim().length === 0) {
      return null;
    }

    let dateTime: Moment.Moment | null = null;

    if (textFormat === TextFormat.DateOnlyShort) {
      dateTime = Moment(value, this._dateOnlyShortFormat, true);
    } else if (textFormat === TextFormat.DateOnlyMedium) {
      dateTime = Moment(value, this._dateOnlyMediumFormat, true);
    } else if (textFormat === TextFormat.DateOnlyLong) {
      dateTime = Moment(value, this._dateOnlyLongFormat, true);
    } else if (textFormat === TextFormat.TimeOnlyShort) {
      dateTime = Moment(value, this._timeOnlyShortFormat, true);
    } else if (textFormat === TextFormat.TimeOnlyMedium) {
      dateTime = Moment(value, this._timeOnlyMediumFormat, true);
    } else if (textFormat === TextFormat.TimeOnlyLong) {
      dateTime = Moment(value, this._timeOnlyLongFormat, true);
    } else if (textFormat === TextFormat.DateTimeShort) {
      dateTime = Moment(value, this._dateTimeShortFormat, true);
    } else if (textFormat === TextFormat.DateTimeMedium) {
      dateTime = Moment(value, this._dateTimeMediumFormat, true);
    } else if (textFormat === TextFormat.DateTimeLong) {
      dateTime = Moment(value, this._dateTimeLongFormat, true);
    }

    if (dateTime == null || !dateTime.isValid()) {
      return null;
    }

    return dateTime;
  }

  private parseMomentFromShortcut(value: string, textFormat: TextFormat, formatPattern: string | null): Moment.Moment | null {
    let dateTime: Moment.Moment | null = null;

    if (textFormat === TextFormat.DateOnlyShort || textFormat === TextFormat.DateOnlyMedium || textFormat === TextFormat.DateOnlyLong) {
      dateTime = this.getDateFromShortcut(value, formatPattern);
    } else if (textFormat === TextFormat.TimeOnlyShort || textFormat === TextFormat.TimeOnlyMedium || textFormat === TextFormat.TimeOnlyLong) {
      dateTime = this.getTimeFromShortcut(value, formatPattern);
    } else if (textFormat === TextFormat.DateTimeShort || textFormat === TextFormat.DateTimeMedium || textFormat === TextFormat.DateTimeLong) {
      dateTime = this.getDateTimeFromShortcut(value, formatPattern);
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
  private getDateFromShortcut(value: string, formatPattern: string | null): Moment.Moment | null {
    if (value.trim().length === 0) {
      return null;
    }

    if (value.startsWith('*')) {
      return this.getDateFromSpecialChar(value);
    }

    const length: number = value.length;

    if (length > 8 || length === 7 || length === 5 || length === 3 || !this._onlyDigitRegExp.test(value)) {
      return null;
    }

    const formatOrder: string | null = this.getDateFormatOrderFromPattern(formatPattern);

    let date: Moment.Moment | null = null;

    if (length === 1) {
      date = Moment(value, 'D');
    } else if (length === 2) {
      date = Moment(value, 'DD');
    } else {
      switch (formatOrder) {
        case this._dayMonthYear:
          if (length === 4) {
            date = Moment(value, 'DDMM');
          } else if (length === 6) {
            date = Moment(value, 'DDMMYY');
          } else if (length === 8) {
            date = Moment(value, 'DDMMYYYY');
          }
          break;
        case this._monthDayYear:
          if (length === 4) {
            date = Moment(value, 'MMDD');
          } else if (length === 6) {
            date = Moment(value, 'MMDDYY');
          } else if (length === 8) {
            date = Moment(value, 'MMDDYYYY');
          }
          break;
        case this._dayYearMonth:
          if (length === 4) {
            date = Moment(value, 'DDMM');
          } else if (length === 6) {
            date = Moment(value, 'DDYYMM');
          } else if (length === 8) {
            date = Moment(value, 'DDYYYYMM');
          }
          break;
        case this._monthYearDay:
          if (length === 4) {
            date = Moment(value, 'MMDD');
          } else if (length === 6) {
            date = Moment(value, 'MMYYDD');
          } else if (length === 8) {
            date = Moment(value, 'MMYYYYDD');
          }
          break;
        case this._yearDayMonth:
          if (length === 4) {
            date = Moment(value, 'DDMM');
          } else if (length === 6) {
            date = Moment(value, 'YYDDMM');
          } else if (length === 8) {
            date = Moment(value, 'YYYYDDMM');
          }
          break;
        case this._yearMonthDay:
          if (length === 4) {
            date = Moment(value, 'MMDD');
          } else if (length === 6) {
            date = Moment(value, 'YYMMDD');
          } else if (length === 8) {
            date = Moment(value, 'YYYYMMDD');
          }
          break;
        default:
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
  private getTimeFromShortcut(value: string, formatPattern: string | null): Moment.Moment | null {
    if (value.trim().length === 0) {
      return null;
    }

    if (value.startsWith('*')) {
      return this.getTimeFromSpecialChar(value);
    }

    const length: number = value.length;

    if (length > 6 || !this._onlyDigitRegExp.test(value)) {
      return null;
    }

    const formatOrder: string | null = this.getTimeFormatOrderFromPattern(formatPattern);

    let time: Moment.Moment | null = null;

    if (length === 1) {
      time = Moment(value, 'H');
    } else if (length === 2) {
      time = Moment(value, 'HH');
    } else {
      switch (formatOrder) {
        case this._hourMinSec:
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
        case this._hourSecMin:
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
        case this._minHourSec:
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
        case this._secHourMin:
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
        case this._minSecHour:
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
        case this._secMinHour:
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
        default:
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
  private getDateTimeFromShortcut(value: string, formatPattern: string | null): Moment.Moment | null {
    if (value.trim().length === 0) {
      return null;
    }

    let separatorPos: number | null = null;

    for (let i = 0; i < value.length; i++) {
      const char: string = value.charAt(i);
      if (this._dtShortcutSeparators.includes(char)) {
        if (separatorPos == null) {
          separatorPos = i;
        } else {
          // If more than one separator is found the shortcut is invalid
          return null;
        }
      }
    }

    let dateTime: Moment.Moment | null = null;

    if (separatorPos != null) {
      if (separatorPos === 0) {
        const timePart: string = value.substring(1);
        if (timePart.trim().length > 0) {
          dateTime = this.getTimeFromShortcut(timePart, formatPattern);
        }
      } else if (separatorPos === value.length - 1) {
        const datePart: string = value.substring(0, value.length - 1);
        if (datePart.trim().length > 0) {
          dateTime = this.getDateFromShortcut(datePart, formatPattern);
        }
      } else {
        const datePart: string = value.substring(0, separatorPos);
        const timePart: string = value.substring(separatorPos + 1);

        const date: Moment.Moment | null = this.getDateFromShortcut(datePart, formatPattern);
        const time: Moment.Moment | null = this.getTimeFromShortcut(timePart, formatPattern);

        if (date == null || !date.isValid() || time == null || !time.isValid()) {
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

  private getDateFormatOrderFromPattern(formatPattern: string | null): string | null {
    const patternValid: (str: string | null) => boolean = pattern => pattern != null && pattern.length === 3;

    let shortPattern: string | null = this.getShortDatePattern(formatPattern);

    if (!patternValid(shortPattern)) {
      shortPattern = this.getShortDatePattern(Moment.localeData().longDateFormat('L'));
      if (!patternValid(shortPattern)) {
        shortPattern = this._dayMonthYear;
      }
    }

    return shortPattern;
  }

  private getShortDatePattern(formatPattern: string | null): string | null {
    if (formatPattern == null || formatPattern.trim().length === 0) {
      return null;
    }

    let shortPattern: string = String.empty();

    for (const char of formatPattern) {
      if ((char === 'D' || char === 'M' || char === 'Y') && !shortPattern.includes(char)) {
        shortPattern += char;
      }
    }

    return shortPattern;
  }

  private getTimeFormatOrderFromPattern(formatPattern: string | null): string | null {
    const patternValid: (str: string | null) => boolean = pattern => pattern != null && pattern.length === 3;

    let shortPattern: string | null = this.getShortTimePattern(formatPattern);

    if (!patternValid(shortPattern)) {
      shortPattern = this.getShortTimePattern(Moment.localeData().longDateFormat('LTS'));
      if (!patternValid(shortPattern)) {
        shortPattern = this._hourMinSec;
      }
    }

    return shortPattern;
  }

  private getShortTimePattern(formatPattern: string | null): string | null {
    if (formatPattern == null || formatPattern.trim().length === 0) {
      return null;
    }

    const hourChar: string = formatPattern.includes('H') ? 'H' : 'h';

    let shortPattern: string = String.empty();

    for (const char of formatPattern) {
      if ((char === hourChar || char === 'm' || char === 's') && !shortPattern.includes(char)) {
        shortPattern += char === hourChar ? char.toUpperCase() : char;
      }
    }

    return shortPattern;
  }

  private getDateFromSpecialChar(value: string): Moment.Moment | null {
    if (value.trim().length === 0 || !value.startsWith('*')) {
      return null;
    }

    const date: Moment.Moment = Moment();

    if (value.startsWith('*+++')) {
      const amount: number | null = this.getAmoutToAdd(value.substring(4));
      if (amount != null) {
        date.add(amount, 'years');
      }
    } else if (value.startsWith('*++')) {
      const amount: number | null = this.getAmoutToAdd(value.substring(3));
      if (amount != null) {
        date.add(amount, 'months');
      }
    } else if (value.startsWith('*+')) {
      const amount: number | null = this.getAmoutToAdd(value.substring(2));
      if (amount != null) {
        date.add(amount, 'days');
      }
    } else if (value.startsWith('*---')) {
      const amount: number | null = this.getAmoutToAdd(value.substring(4));
      if (amount != null) {
        date.subtract(amount, 'years');
      }
    } else if (value.startsWith('*--')) {
      const amount: number | null = this.getAmoutToAdd(value.substring(3));
      if (amount != null) {
        date.subtract(amount, 'months');
      }
    } else if (value.startsWith('*-')) {
      const amount: number | null = this.getAmoutToAdd(value.substring(2));
      if (amount != null) {
        date.subtract(amount, 'days');
      }
    }

    return date;
  }

  private getTimeFromSpecialChar(value: string): Moment.Moment | null {
    if (!value.startsWith('*')) {
      return null;
    }

    const time: Moment.Moment = Moment();

    if (value.startsWith('*+++')) {
      const amount: number | null = this.getAmoutToAdd(value.substring(4));
      if (amount != null) {
        time.add(amount, 'hours');
      }
    } else if (value.startsWith('*++')) {
      const amount: number | null = this.getAmoutToAdd(value.substring(3));
      if (amount != null) {
        time.add(amount, 'minutes');
      }
    } else if (value.startsWith('*+')) {
      const amount: number | null = this.getAmoutToAdd(value.substring(2));
      if (amount != null) {
        time.add(amount, 'seconds');
      }
    } else if (value.startsWith('*---')) {
      const amount: number | null = this.getAmoutToAdd(value.substring(4));
      if (amount != null) {
        time.subtract(amount, 'hours');
      }
    } else if (value.startsWith('*--')) {
      const amount: number | null = this.getAmoutToAdd(value.substring(3));
      if (amount != null) {
        time.subtract(amount, 'minutes');
      }
    } else if (value.startsWith('*-')) {
      const amount: number | null = this.getAmoutToAdd(value.substring(2));
      if (amount != null) {
        time.subtract(amount, 'seconds');
      }
    }

    return time;
  }

  private getAmoutToAdd(value: string): number | null {
    if (value.trim().length === 0 || !this._onlyDigitRegExp.test(value)) {
      return null;
    }

    return Number(value);
  }
}

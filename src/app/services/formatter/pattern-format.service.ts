import { Injectable } from '@angular/core';

@Injectable()
export class PatternFormatService {

  private static readonly javaToMomentMap: Map<string, string> = new Map<string, string>([
    ['d', 'D'],               // day in month - one or two digits
    ['dd', 'DD'],             // day in month - two digits
    ['D', 'DDD'],             // day in year - one to three digits
    ['DD', String.empty()],   // day in year- two or three digits
    ['DDD', 'DDDD'],          // day in year- three digits
    ['F', String.empty()],    // day of week in month
    ['y', 'YYYY'],            // year - every digit
    ['yy', 'YY'],             // year - two digits
    ['yyy', 'YYYY'],          // year - three digits
    ['yyyy', 'YYYY'],         // year - every digit
    ['Y', String.empty()],    // week year - two digits
    ['YY', 'gg'],             // week year - two digits
    ['YYY', String.empty()],  // week year - three digits
    ['YYYY', 'gggg'],         // week year - all digits
    ['a', 'A'],               // AM or PM
    ['G', String.empty()],    // era - AD or BC
    ['M', 'M'],               // month in year - two digits, 1..12
    ['MM', 'MM'],             // month in year - two digits, 01..12
    ['MMM', 'MMM'],           // month in year - short text
    ['MMMM', 'MMMM'],         // month in year - full text
    ['h', 'h'],               // hour - one or two digits, 12 hours, 1..12
    ['hh', 'hh'],             // hour - two digits, 12 hours, 01..12
    ['H', 'H'],               // hour - one or two digits, 24 hours, 0..23
    ['HH', 'HH'],             // hour - two digits, 24 hours, 00..23
    ['k', 'k'],               // hour - one or two digits, 12 hours, 1..24
    ['kk', 'kk'],             // hour - two digits, 24 hours, 01..24
    ['K', String.empty()],    // hour - one or two digits, 12 hours, 0..11
    ['KK', String.empty()],   // hour - two digits, 12 hours, 00..11
    ['m', 'm'],               // minutes - one or two digits
    ['mm', 'mm'],             // minutes - two digits
    ['s', 's'],               // seconds- one or two digits
    ['ss', 'ss'],             // seconds - two digits
    ['S', 'S'],               // millisecond
    ['SS', 'SS'],             // millisecond
    ['SSS', 'SSS'],           // millisecond
    ['E', 'ddd'],             // day name in week - short
    ['EE', 'ddd'],            // day name in week - short
    ['EEE', 'ddd'],           // day name in week - short
    ['EEEE', 'dddd'],         // day name in week - full
    ['w', 'W'],               // week in year - one or two digits
    ['ww', 'WW'],             // week in year - two digits, zero-padded
    ['W', String.empty()],    // week in month - one or two digits
    ['WW', String.empty()],   // week in month - two digits, zero-padded
    ['z', String.empty()],    // General time zone
    ['zz', String.empty()],   // General time zone
    ['zzz', String.empty()],  // General time zone
    ['zzzz', String.empty()], // General time zone
    ['Z', 'ZZ'],              // RFC 822 time zone
    ['X', String.empty()],    // ISO 8601 time zone -  - hours only
    ['XX', 'ZZ'],             // ISO 8601 time zone - short
    ['XXX', 'Z'],             // ISO 8601 time zone - long
    ['u', 'E']                // day number of week - 1=Monday, 7=Sunday
  ]);

  private static readonly momentToJavaMap: Map<string, string> = new Map<string, string>([
    ['d', String.empty()],    // day in week - 0=Sunday, 6=Saturday
    ['D', 'd'],               // day in month - one or two digits
    ['DD', 'dd'],             // day in month - two digits
    ['Do', String.empty()],   // day of month with ordinal
    ['Y', String.empty()],    // year - any number of digits and sign
    ['YY', 'yy'],             // year - two digits
    ['YYYY', 'yyyy'],         // year - all digits
    ['a', String.empty()],    // am or pm
    ['A', 'a'],               // AM or PM
    ['M', 'M'],               // month in year - two digits, 01..12
    ['MM', 'MM'],             // month in year - two digits, 01..12
    ['MMM', 'MMM'],           // month in year - short text
    ['MMMM', 'MMMM'],         // month in year - full text
    ['h', 'h'],               // hour - one or two digits, 12 hours, 1..12
    ['hh', 'hh'],             // hour - two or two digits, 12 hours, 01..12
    ['H', 'H'],               // hour - one or two digits, 24 hours, 0..23
    ['HH', 'HH'],             // hour - two digits, 24 hours, 00..23
    ['k', 'k'],               // hour - one or two digits, 24 hours, 1..24
    ['kk', 'kk'],             // hour - two digits, 24 hours, 01..24
    ['m', 'm'],               // minutes - one or two digits
    ['mm', 'mm'],             // minutes - two digits
    ['s', 's'],               // seconds - one or two digits
    ['ss', 'ss'],             // second - two digits
    ['S', 'S'],               // fractional seconds - 0...999
    ['SS', 'SS'],             // fractional seconds - 00...999
    ['SSS', 'SSS'],           // fractional seconds - 000...999
    ['ddd', 'E'],             // day name - short
    ['dddd', 'EEEE'],         // day name - full
    ['DDD', 'D'],             // day in year
    ['DDDD', 'DDD'],          // day in year
    ['W', 'w'],               // week in year - one or two digits, 1..53
    ['WW', 'ww'],             // week in year - two digits, 01..53
    ['w', String.empty()],    // locale week in year - one or two digits, 1..53
    ['ww', String.empty()],   // locale week in year - two digits, 01..53
    ['ZZ', 'ZZ'],             // offset from UTC
    ['Z', 'XXX'],             // offset from UTC
    ['E', 'u'],               // ISO day of week - 1..7
    ['e', String.empty()],    // Locale day of week - 0..6
    ['Q', String.empty()],    // quarter in year - 1..4
    ['X', String.empty()],    // UNIX timestamp
    ['x', String.empty()]     // UNIX timestamp - milliseconds
  ]);

  public javaToMoment(formatPattern: string): string {
    return this.translateFormat(formatPattern, PatternFormatService.javaToMomentMap, '\'', '\'', '[', ']');
  }

  public momentToJava(formatPattern: string): string {
    return this.translateFormat(formatPattern, PatternFormatService.momentToJavaMap, '[', ']', '\'', '\'');
  }

  private translateFormat(formatPattern: string, map: Map<string, string>, escapeStartChar: string, escapeEndChar: string,
    targetEscapeStartChar: string, targetEscapeEndChar: string): string {

    if (String.isNullOrWhiteSpace(formatPattern)) {
      return null;
    }

    let resultPattern: string = String.empty();
    let pendingPattern: string = String.empty();
    let isEscaped: boolean = false;

    for (let i = 0; i < formatPattern.length; i++) {
      const currentChar: string = formatPattern.charAt(i);
      const nextChar: string = formatPattern.charAt(i + 1);

      if (!isEscaped && currentChar === escapeStartChar) {
        isEscaped = true;
        resultPattern += targetEscapeStartChar;
        continue;
      } else if (isEscaped && currentChar === escapeEndChar) {
        isEscaped = false;
        resultPattern += targetEscapeEndChar;
        continue;
      } else if (isEscaped) {
        resultPattern += currentChar;
        continue;
      }

      if (currentChar === nextChar) {
        pendingPattern += currentChar;
      } else {
        pendingPattern += currentChar;
        resultPattern += map.has(pendingPattern) ? map.get(pendingPattern) : pendingPattern;
        pendingPattern = String.empty();
      }
    }

    return resultPattern;
  }
}

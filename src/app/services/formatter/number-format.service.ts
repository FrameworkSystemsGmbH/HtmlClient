import { Injectable } from '@angular/core';

import { LocaleService } from '.././locale.service';
import { NumberFormatInfo } from '../../common';
import { TextFormat } from '../../enums';

export interface INumberFormatService {
  formatString(value: string, textFormat: TextFormat, formatPattern: string): string;
  formatNumber(value: number, textFormat: TextFormat, formatPattern: string): string;
  parseString(value: string, textFormat: TextFormat, formatPattern: string): number;
}

@Injectable()
export class NumberFormatService implements INumberFormatService {

  private static readonly formatDefault: string = '#.#';
  private static readonly formatZero: string = '0';
  private static readonly formatHash: string = '#';
  private static readonly formatSeparator: string = ';';
  private static readonly formatGroupSeparator: string = ',';
  private static readonly formatDecimalSeparator: string = '.';
  private static readonly formatStringChars: string = '\'"';
  private static readonly formatNegativeSign: string = '-';
  private static readonly formatPercentSign: string = '%';
  private static readonly formatPermilleSign: string = '‰';
  private static readonly formatEscapeChar: string = '\\';

  private readonly numberFormat: Intl.NumberFormat;

  constructor(private localeService: LocaleService) {
    this.numberFormat = Intl.NumberFormat(this.localeService.getLocale());
  }

  private getGroupingCount(): number {
    return this.numberFormat.resolvedOptions().maximumFractionDigits;
  }

  private getGroupingSeparator(): string {
    return this.numberFormat.format(1111).substring(1, 2);
  }

  private getDecimalSeparator(): string {
    return this.numberFormat.format(1.1).substring(1, 2);
  }

  private isHash(char: string): boolean {
    return char === NumberFormatService.formatHash;
  }

  private isZero(char: string): boolean {
    return char === NumberFormatService.formatZero;
  }

  private isHashOrZero(char: string): boolean {
    return this.isHash(char) || this.isZero(char);
  }

  private isGroupSeparator(char: string): boolean {
    return char === NumberFormatService.formatGroupSeparator;
  }

  private isDecimalSeparator(char: string): boolean {
    return char === NumberFormatService.formatDecimalSeparator;
  }

  private isStringChar(char: string): boolean {
    return NumberFormatService.formatStringChars.indexOf(char) >= 0;
  }

  private isEscapeChar(char: string): boolean {
    return char === NumberFormatService.formatEscapeChar;
  }

  private isPercentSign(char: string): boolean {
    return char === NumberFormatService.formatPercentSign;
  }

  private isPermilleSign(char: string): boolean {
    return char === NumberFormatService.formatPermilleSign;
  }

  public formatString(value: string, textFormat: TextFormat, formatPattern: string): string {
    if (value == null) {
      return null;
    }

    let valueStr: string = this.cleanNumberString(value);

    if (String.isNullOrWhiteSpace(valueStr)) {
      return null;
    }

    let valueNum: number = Number(valueStr);

    return this.formatNumber(valueNum, textFormat, formatPattern);
  }

  public formatNumber(value: number, textFormat: TextFormat, formatPattern: string): string {
    if (value == null || Number.isNaN(value)) {
      return null;
    }

    switch (textFormat) {
      case TextFormat.Integer:
        return this.adjustNumberInteger(value).toString();
      case TextFormat.PositiveInteger:
        return this.adjustNumberPositiveInteger(value).toString();
      case TextFormat.NegativeInteger:
        return this.adjustNumberNegativeInteger(value).toString();
      case TextFormat.Decimal:
        if (formatPattern) {
          return this.formatNumberPattern(value, formatPattern);
        } else {
          return this.formatNumberDefault(value);
        }
      default:
        return this.formatNumberDefault(value);
    }
  }

  private formatNumberDefault(value: number): string {
    if (value == null || Number.isNaN(value)) {
      return null;
    }

    return this.numberFormat.format(value);
  }

  private formatNumberPattern(value: number, formatPattern: string): string {
    if (value == null || Number.isNaN(value)) {
      return null;
    }

    let pattern: string = formatPattern;

    if (String.isNullOrWhiteSpace(formatPattern)) {
      pattern = NumberFormatService.formatDefault;
    }

    let activeFormat: string;

    let formats: string[] = formatPattern.split(NumberFormatService.formatSeparator, 3);

    if (value === 0 && formats.length === 3) {
      activeFormat = formats[2];
    } else if (value < 0 && formats.length > 1) {
      activeFormat = formats[1];
    } else {
      activeFormat = formats[0];
    }

    return this.formatNumberPatternInternal(value, this.getFormatInfo(activeFormat));
  }

  private formatNumberPatternInternal(value: number, formatInfo: NumberFormatInfo): string {
    let actualValue: number = value;

    if (formatInfo.isPercent) {
      actualValue = actualValue * 100;
    }

    if (formatInfo.isPermille) {
      actualValue = actualValue * 1000;
    }

    let hasDecimalPart: boolean = formatInfo.hasDecimalsPart();

    if (hasDecimalPart && formatInfo.hasLastDecimalZero()) {
      actualValue = Math.roundDec(actualValue, -(formatInfo.lastDecimalZeroPos + 1));
    } else if (!hasDecimalPart) {
      actualValue = Math.roundDec(actualValue, 0);
    }

    let valueNegative: boolean = actualValue < 0;
    let valueAbs: number = Math.abs(actualValue);
    let valueAbsStr: string = valueAbs.toString();
    let valueDecimalPointPos: number = valueAbsStr.indexOf('.');
    let valueDigitsStr: string;
    let valueDigitsCount: number = 0;
    let valueDecimalsStr: string;
    let valueDecimalsCount: number = 0;

    if (valueDecimalPointPos >= 0) {
      valueDigitsStr = valueAbsStr.substring(0, valueDecimalPointPos);
      valueDigitsCount = valueDigitsStr.length;
      valueDecimalsStr = valueAbsStr.substring(valueDecimalPointPos + 1, valueAbsStr.length);
      valueDecimalsCount = valueDecimalsStr.length;
    } else {
      valueDigitsStr = valueAbsStr;
      valueDigitsCount = valueDigitsStr.length;
    }

    let resultStr: string = String.empty();

    if (formatInfo.hasPrefixPart()) {
      resultStr += formatInfo.prefixPart;
    }

    // Add negative sign if necessary
    if (valueNegative && !formatInfo.negativeFirst) {
      resultStr += NumberFormatService.formatNegativeSign;
    }

    if (formatInfo.hasDigitsPart()) {
      let digitsStr: string = String.empty();

      // Pad zeros on left side if necessary
      if (formatInfo.hasFirstDigitZero()) {
        let padZeroCount: number = formatInfo.getDigitsCount() - valueDigitsCount - formatInfo.firstDigitZeroPos;
        if (padZeroCount > 0) {
          for (let i = 0; i < padZeroCount; i++) {
            digitsStr += '0';
          }
        }
      }

      if (!String.isNullOrWhiteSpace(valueDigitsStr)) {
        digitsStr += valueDigitsStr;
      }

      // Add grouping separators if grouping is active
      if (formatInfo.hasGrouping) {
        let groupSep: string = this.getGroupingSeparator();
        let groupingCount: number = this.getGroupingCount();

        for (let i = 0; i < digitsStr.length; i++) {
          if (i > 0 && ((digitsStr.length - i) % groupingCount) === 0) {
            resultStr += groupSep;
          }

          resultStr += digitsStr.charAt(i);
        }
      } else {
        resultStr += digitsStr;
      }
    }

    if ((formatInfo.hasDecimalsPart() && valueDecimalPointPos != null) || formatInfo.hasLastDecimalZero()) {
      resultStr += this.getDecimalSeparator();

      if (!String.isNullOrWhiteSpace(valueDecimalsStr)) {
        resultStr += valueDecimalsStr
      }

      // Pad zeros on right side if necessary
      if (formatInfo.hasLastDecimalZero()) {
        let padZeroCount: number = formatInfo.lastDecimalZeroPos + 1 - valueDecimalsCount;
        if (padZeroCount > 0) {
          for (let i = 0; i < padZeroCount; i++) {
            resultStr += '0';
          }
        }
      }
    }

    if (formatInfo.hasSuffixPart()) {
      resultStr += formatInfo.suffixPart;
    }

    if (valueNegative && formatInfo.negativeFirst) {
      resultStr = NumberFormatService.formatNegativeSign + resultStr;
    }

    return resultStr;
  }

  public parseString(value: string, textFormat: TextFormat, formatPattern: string = null): number {
    let valueStr: string = value;

    if (valueStr == null) {
      return null;
    }

    if (formatPattern == null) {
      return Number(this.cleanNumberString(valueStr));
    }

    let formatInfo: NumberFormatInfo = this.getFormatInfo(formatPattern);

    if (formatInfo.hasPrefixPart()) {
      valueStr = valueStr.trimStringLeft(formatInfo.prefixPart);
    }

    if (formatInfo.hasSuffixPart()) {
      valueStr = valueStr.trimStringRight(formatInfo.suffixPart);
    }

    let valueNum: number = Number(this.cleanNumberString(valueStr));

    if (Number.isNaN(valueNum)) {
      return null;
    }

    switch (textFormat) {
      case TextFormat.Integer:
        valueNum = this.adjustNumberInteger(valueNum);
        break;
      case TextFormat.PositiveInteger:
        valueNum = this.adjustNumberPositiveInteger(valueNum);
        break;
      case TextFormat.NegativeInteger:
        valueNum = this.adjustNumberNegativeInteger(valueNum);
        break;
      case TextFormat.Decimal:
        if (formatPattern) {
          return this.adjustNumberPattern(valueNum, formatPattern);
        }
        break;
    }
  }

  private adjustNumberInteger(value: number): number {
    if (value == null || Number.isNaN(value)) {
      return null;
    }

    return Math.roundDec(value, 0);
  }

  private adjustNumberPositiveInteger(value: number): number {
    if (value == null || Number.isNaN(value)) {
      return null;
    }

    return Math.abs(Math.roundDec(value, 0));
  }

  private adjustNumberNegativeInteger(value: number): number {
    if (value == null || Number.isNaN(value)) {
      return null;
    }

    let num: number = Math.roundDec(value, 0);

    if (num > 0) {
      num = -num;
    }

    return num;
  }

  private adjustNumberPattern(value: number, formatPattern: string): number {
    if (value == null || Number.isNaN(value)) {
      return null;
    }

    if (String.isNullOrWhiteSpace(formatPattern)) {
      return value;
    }

    let formatInfo: NumberFormatInfo = this.getFormatInfo(formatPattern);

    if (formatInfo.hasDecimalsPart() && formatInfo.hasLastDecimalZero()) {
      return Math.roundDec(value, -(formatInfo.lastDecimalZeroPos + 1));
    }

    return value;
  }

  private getFormatInfo(format: string): NumberFormatInfo {
    let formatToDo = format;
    let negativeFirst: boolean = formatToDo.charAt(0) === NumberFormatService.formatNegativeSign;

    if (negativeFirst) {
      formatToDo = formatToDo.substring(1);
    }

    let isInString: boolean = false;
    let hasGrouping: boolean = false;
    let isPercent: boolean = false;
    let isPermille: boolean = false;

    let digitsPos: number;
    let decimalsPos: number;
    let suffixPos: number;
    let firstDigitPos: number;
    let lastDigitPos: number;
    let firstDigitZeroPos: number;
    let groupingSeparatorPos: number;
    let lastDecimalZeroPos: number;

    let prefixPart: string = String.empty();
    let digitsPart: string = String.empty();
    let decimalsPart: string = String.empty();
    let suffixPart: string = String.empty();

    // Get the prefix part if available
    for (let i = 0; i < formatToDo.length; i++) {
      let char: string = formatToDo.charAt(i);
      let nextChar: string = formatToDo.charAt(i + 1);

      if (this.isStringChar(char)) {
        isInString = !isInString;
      } else if (isInString) {
        prefixPart += char;
      } else if (this.isEscapeChar(char) && nextChar) {
        prefixPart += nextChar;
        i++;
      } else if (this.isGroupSeparator(char)) {
        continue;
      } else if (this.isHashOrZero(char) || this.isDecimalSeparator(char)) {
        digitsPos = i;
        break;
      } else {
        if (this.isPercentSign(char)) {
          isPercent = true;
        }
        if (this.isPermilleSign(char)) {
          isPermille = true;
        }
        prefixPart += char;
      }
    }

    // Get the digits part if available
    if (digitsPos != null) {
      formatToDo = formatToDo.substring(digitsPos);
      if (formatToDo) {
        for (let i = 0; i < formatToDo.length; i++) {
          let char: string = formatToDo.charAt(i);
          if (this.isHashOrZero(char)) {
            if (firstDigitPos == null) {
              firstDigitPos = i;
            }
            lastDigitPos = i;
            digitsPart += char;
          } else if (this.isGroupSeparator(char) && groupingSeparatorPos == null) {
            groupingSeparatorPos = i;
          } else if (this.isDecimalSeparator(char)) {
            decimalsPos = i + 1;
            break;
          } else {
            suffixPos = i;
            break;
          }
        }
      }
    }

    // Get the decimal part if available
    if (decimalsPos != null) {
      formatToDo = formatToDo.substring(decimalsPos);
      if (formatToDo) {
        for (let i = 0; i < formatToDo.length; i++) {
          let char: string = formatToDo.charAt(i);
          if (this.isHashOrZero(char)) {
            decimalsPart += char;
          } else if (this.isGroupSeparator(char) || this.isDecimalSeparator(char)) {
            continue;
          } else {
            suffixPos = i;
            break;
          }
        }
      }
    }

    // Get the suffix part if available
    if (suffixPos != null) {
      formatToDo = formatToDo.substring(suffixPos);
      if (formatToDo != null) {
        isInString = false;
        for (let i = 0; i < formatToDo.length; i++) {
          let char: string = formatToDo.charAt(i);
          let nextChar: string = formatToDo.charAt(i + 1);
          if (this.isStringChar(char)) {
            isInString = !isInString;
          } else if (isInString) {
            suffixPart += char;
          } else if (this.isEscapeChar(char) && nextChar) {
            suffixPart += nextChar;
            i++;
          } else if (this.isHashOrZero(char) || this.isDecimalSeparator(char) || this.isGroupSeparator(char)) {
            continue;
          } else {
            if (this.isPercentSign(char)) {
              isPercent = true;
            }
            if (this.isPermilleSign(char)) {
              isPermille = true;
            }
            suffixPart += char;
          }
        }
      }
    }

    firstDigitZeroPos = digitsPart ? digitsPart.indexOf(NumberFormatService.formatZero) : undefined;
    lastDecimalZeroPos = decimalsPart ? decimalsPart.lastIndexOf(NumberFormatService.formatZero) : undefined;

    hasGrouping = firstDigitPos != null &&
      lastDigitPos != null &&
      groupingSeparatorPos != null &&
      firstDigitPos < groupingSeparatorPos &&
      lastDigitPos > groupingSeparatorPos;

    let formatInfo: NumberFormatInfo = new NumberFormatInfo();
    formatInfo.prefixPart = prefixPart;
    formatInfo.digitsPart = digitsPart;
    formatInfo.decimalsPart = decimalsPart;
    formatInfo.suffixPart = suffixPart;
    formatInfo.firstDigitZeroPos = firstDigitZeroPos != null && firstDigitZeroPos >= 0 ? firstDigitZeroPos : undefined;
    formatInfo.lastDecimalZeroPos = lastDecimalZeroPos != null && lastDecimalZeroPos >= 0 ? lastDecimalZeroPos : undefined;
    formatInfo.isPercent = isPercent;
    formatInfo.isPermille = isPermille;
    formatInfo.hasGrouping = hasGrouping;
    formatInfo.negativeFirst = negativeFirst;

    return formatInfo;
  }

  private cleanNumberString(value: string): string {
    if (String.isNullOrWhiteSpace(value)) {
      return null;
    }

    let groupSep: string = this.getGroupingSeparator();
    let decSep: string = this.getDecimalSeparator();

    return value
      .replace(groupSep, String.empty())
      .replace(decSep, '.')
      .replace(/[^0-9\-\.]/g, String.empty())
      .replace(/^([^.]*\.)(.*)$/, (val, left, right) => left + right.replace(/\./g, String.empty()))
      .trim()
      .trimChars('0');
  }
}

import { Injectable } from '@angular/core';
import { NumberFormatInfo } from '@app/common/number-format-info';
import { ParseMethod } from '@app/enums/parse-method';
import { TextFormat } from '@app/enums/text-format';
import { LocaleService } from '@app/services/locale.service';

@Injectable({ providedIn: 'root' })
export class NumberFormatService {

  private static readonly _formatDefault: string = '#.##';
  private static readonly _formatZero: string = '0';
  private static readonly _formatHash: string = '#';
  private static readonly _formatSeparator: string = ';';
  private static readonly _formatGroupSeparator: string = ',';
  private static readonly _formatDecimalSeparator: string = '.';
  private static readonly _formatStringChars: string = '\'"';
  private static readonly _formatNegativeSign: string = '-';
  private static readonly _formatPercentSign: string = '%';
  private static readonly _formatPermilleSign: string = '‰';
  private static readonly _formatEscapeChar: string = '\\';

  private readonly _numberFormat: Intl.NumberFormat;

  public constructor(private readonly _localeService: LocaleService) {
    this._numberFormat = Intl.NumberFormat(this._localeService.getLocale());
  }

  private getGroupingCount(): number {
    return this._numberFormat.resolvedOptions().maximumFractionDigits;
  }

  private getGroupingSeparator(): string {
    return this._numberFormat.format(1111).substring(1, 2);
  }

  private getDecimalSeparator(): string {
    return this._numberFormat.format(1.1).substring(1, 2);
  }

  private isHash(char: string): boolean {
    return char === NumberFormatService._formatHash;
  }

  private isZero(char: string): boolean {
    return char === NumberFormatService._formatZero;
  }

  private isHashOrZero(char: string): boolean {
    return this.isHash(char) || this.isZero(char);
  }

  private isGroupSeparator(char: string): boolean {
    return char === NumberFormatService._formatGroupSeparator;
  }

  private isDecimalSeparator(char: string): boolean {
    return char === NumberFormatService._formatDecimalSeparator;
  }

  private isStringChar(char: string): boolean {
    return NumberFormatService._formatStringChars.includes(char);
  }

  private isEscapeChar(char: string): boolean {
    return char === NumberFormatService._formatEscapeChar;
  }

  private isPercentSign(char: string): boolean {
    return char === NumberFormatService._formatPercentSign;
  }

  private isPermilleSign(char: string): boolean {
    return char === NumberFormatService._formatPermilleSign;
  }

  public formatString(value: string, parseMethod: ParseMethod, textFormat: TextFormat, formatPattern: string | null): string | null {
    const valueStr: string | null = this.cleanNumberString(value, parseMethod);

    const valueNum: number = Number(valueStr);

    return this.formatNumber(valueNum, textFormat, formatPattern);
  }

  public formatNumber(value: number, textFormat: TextFormat, formatPattern: string | null): string | null {
    if (Number.isNaN(value)) {
      return null;
    }

    switch (textFormat) {
      case TextFormat.Integer:
        const numInt: number | null = this.adjustNumberInteger(value);
        return numInt != null ? numInt.toString() : null;
      case TextFormat.PositiveInteger:
        const numIntPos: number | null = this.adjustNumberPositiveInteger(value);
        return numIntPos != null ? numIntPos.toString() : null;
      case TextFormat.NegativeInteger:
        const numIntNeg: number | null = this.adjustNumberNegativeInteger(value);
        return numIntNeg != null ? numIntNeg.toString() : null;
      case TextFormat.Decimal:
      case TextFormat.UserDefined:
        if (formatPattern != null) {
          return this.formatNumberPattern(value, formatPattern);
        } else {
          return this.formatNumberDefault(value);
        }
      default:
        return this.formatNumberDefault(value);
    }
  }

  private formatNumberDefault(value: number): string | null {
    if (Number.isNaN(value)) {
      return null;
    }

    return this._numberFormat.format(value);
  }

  private formatNumberPattern(value: number, formatPattern: string): string | null {
    if (Number.isNaN(value)) {
      return null;
    }

    let pattern: string = formatPattern;

    if (String.isNullOrWhiteSpace(formatPattern)) {
      pattern = NumberFormatService._formatDefault;
    }

    let activeFormat: string;

    const formats: Array<string> = pattern.split(NumberFormatService._formatSeparator, 3);

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
      actualValue *= 100;
    }

    if (formatInfo.isPermille) {
      actualValue *= 1000;
    }

    if (formatInfo.hasDecimalsPart()) {
      actualValue = Math.roundDec(actualValue, -formatInfo.getDecimalsCount());
    } else {
      actualValue = Math.roundDec(actualValue, 0);
    }

    const valueNegative: boolean = actualValue < 0;
    const valueAbs: number = Math.abs(actualValue);
    const valueAbsStr: string = valueAbs.toString();
    const valueDecimalPointPos: number = valueAbsStr.indexOf('.');

    let valueDigitsStr: string | null = null;
    let valueDigitsCount: number = 0;
    let valueDecimalsStr: string | null = null;
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
      resultStr += NumberFormatService._formatNegativeSign;
    }

    if (formatInfo.hasDigitsPart()) {
      let digitsStr: string = String.empty();

      // Pad zeros on left side if necessary
      if (formatInfo.firstDigitZeroPos != null) {
        const padZeroCount: number = formatInfo.getDigitsCount() - valueDigitsCount - formatInfo.firstDigitZeroPos;
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
        const groupSep: string = this.getGroupingSeparator();
        const groupingCount: number = this.getGroupingCount();

        for (let i = 0; i < digitsStr.length; i++) {
          if (i > 0 && (digitsStr.length - i) % groupingCount === 0) {
            resultStr += groupSep;
          }

          resultStr += digitsStr.charAt(i);
        }
      } else {
        resultStr += digitsStr;
      }
    }

    if (formatInfo.hasDecimalsPart() && valueDecimalPointPos >= 0 || formatInfo.lastDecimalZeroPos != null) {
      resultStr += this.getDecimalSeparator();

      if (!String.isNullOrWhiteSpace(valueDecimalsStr)) {
        resultStr += valueDecimalsStr;
      }

      // Pad zeros on right side if necessary
      if (formatInfo.lastDecimalZeroPos != null) {
        const padZeroCount: number = formatInfo.lastDecimalZeroPos + 1 - valueDecimalsCount;
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
      resultStr = NumberFormatService._formatNegativeSign + resultStr;
    }

    return resultStr;
  }

  public parseString(value: string, parseMethod: ParseMethod, textFormat: TextFormat, formatPattern: string | null = null): number | null {
    let valueStr: string = value;

    if (formatPattern == null) {
      return Number(this.cleanNumberString(valueStr, parseMethod));
    }

    const formatInfo: NumberFormatInfo = this.getFormatInfo(formatPattern);

    if (formatInfo.hasPrefixPart()) {
      valueStr = valueStr.trimStringLeft(formatInfo.prefixPart);
    }

    if (formatInfo.hasSuffixPart()) {
      valueStr = valueStr.trimStringRight(formatInfo.suffixPart);
    }

    let valueNum: number | null = Number(this.cleanNumberString(valueStr, parseMethod));

    if (Number.isNaN(valueNum)) {
      return null;
    }

    if (textFormat === TextFormat.Integer) {
      valueNum = this.adjustNumberInteger(valueNum);
    } else if (textFormat === TextFormat.PositiveInteger) {
      valueNum = this.adjustNumberPositiveInteger(valueNum);
    } else if (textFormat === TextFormat.NegativeInteger) {
      valueNum = this.adjustNumberNegativeInteger(valueNum);
    } else if (textFormat === TextFormat.Decimal && !String.isNullOrEmpty(formatPattern)) {
      valueNum = this.adjustNumberPattern(valueNum, formatPattern);
    } else if (textFormat === TextFormat.UserDefined && !String.isNullOrEmpty(formatPattern)) {
      valueNum = this.adjustNumberPattern(valueNum, formatPattern);
    }

    return valueNum;
  }

  private adjustNumberInteger(value: number): number | null {
    if (Number.isNaN(value)) {
      return null;
    }

    return Math.roundDec(value, 0);
  }

  private adjustNumberPositiveInteger(value: number): number | null {
    if (Number.isNaN(value)) {
      return null;
    }

    return Math.abs(Math.roundDec(value, 0));
  }

  private adjustNumberNegativeInteger(value: number): number | null {
    if (Number.isNaN(value)) {
      return null;
    }

    let num: number = Math.roundDec(value, 0);

    if (num > 0) {
      num = -num;
    }

    return num;
  }

  private adjustNumberPattern(value: number, formatPattern: string): number | null {
    if (Number.isNaN(value)) {
      return null;
    }

    if (String.isNullOrWhiteSpace(formatPattern)) {
      return value;
    }

    const formatInfo: NumberFormatInfo = this.getFormatInfo(formatPattern);

    let actualValue: number = value;

    if (formatInfo.hasDecimalsPart()) {
      actualValue = Math.roundDec(actualValue, -formatInfo.getDecimalsCount());
    } else {
      actualValue = Math.roundDec(actualValue, 0);
    }

    return actualValue;
  }

  private getFormatInfo(format: string): NumberFormatInfo {
    let formatToDo: string = format;
    const negativeFirst: boolean = formatToDo.startsWith(NumberFormatService._formatNegativeSign);

    if (negativeFirst) {
      formatToDo = formatToDo.substring(1);
    }

    let isInString: boolean = false;
    let hasGrouping: boolean = false;
    let isPercent: boolean = false;
    let isPermille: boolean = false;

    let digitsPos: number | null = null;
    let decimalsPos: number | null = null;
    let suffixPos: number | null = null;
    let firstDigitPos: number | null = null;
    let lastDigitPos: number | null = null;
    let groupingSeparatorPos: number | null = null;

    let prefixPart: string = String.empty();
    let digitsPart: string = String.empty();
    let decimalsPart: string = String.empty();
    let suffixPart: string = String.empty();

    // Get the prefix part if available
    for (let i = 0; i < formatToDo.length; i++) {
      const char: string = formatToDo.charAt(i);
      const nextChar: string = formatToDo.charAt(i + 1);

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
          const char: string = formatToDo.charAt(i);
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
          const char: string = formatToDo.charAt(i);
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
      if (formatToDo.length) {
        isInString = false;
        for (let i = 0; i < formatToDo.length; i++) {
          const char: string = formatToDo.charAt(i);
          const nextChar: string = formatToDo.charAt(i + 1);
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

    const firstDigitZeroPos: number | undefined = digitsPart ? digitsPart.indexOf(NumberFormatService._formatZero) : undefined;
    const lastDecimalZeroPos: number | undefined = decimalsPart ? decimalsPart.lastIndexOf(NumberFormatService._formatZero) : undefined;

    hasGrouping = firstDigitPos != null &&
      lastDigitPos != null &&
      groupingSeparatorPos != null &&
      firstDigitPos < groupingSeparatorPos &&
      lastDigitPos > groupingSeparatorPos;

    const formatInfo: NumberFormatInfo = new NumberFormatInfo();
    formatInfo.prefixPart = prefixPart;
    formatInfo.digitsPart = digitsPart;
    formatInfo.decimalsPart = decimalsPart;
    formatInfo.suffixPart = suffixPart;
    formatInfo.firstDigitZeroPos = firstDigitZeroPos != null && firstDigitZeroPos >= 0 ? firstDigitZeroPos : null;
    formatInfo.lastDecimalZeroPos = lastDecimalZeroPos != null && lastDecimalZeroPos >= 0 ? lastDecimalZeroPos : null;
    formatInfo.isPercent = isPercent;
    formatInfo.isPermille = isPermille;
    formatInfo.hasGrouping = hasGrouping;
    formatInfo.negativeFirst = negativeFirst;

    return formatInfo;
  }

  private cleanNumberString(value: string, parseMethod: ParseMethod): string | null {
    if (String.isNullOrWhiteSpace(value)) {
      return null;
    }

    const groupSep: string = parseMethod === ParseMethod.Client ? this.getGroupingSeparator() : NumberFormatService._formatGroupSeparator;
    const decSep: string = parseMethod === ParseMethod.Client ? this.getDecimalSeparator() : NumberFormatService._formatDecimalSeparator;

    return value
      .replaceAll(groupSep, String.empty())
      .replaceAll(decSep, NumberFormatService._formatDecimalSeparator)
      .replace(/[^0-9\-.]/g, String.empty())
      .replace(/^([^.]*\.)(.*)$/, (_val: string, left: string, right: string) => left + right.replace(/\./g, String.empty()))
      .trim();
  }
}

import { Injectable } from '@angular/core';
import { PropertyData } from '@app/common/property-data';
import { PropertyLayer } from '@app/common/property-layer';
import { PropertyStore } from '@app/common/property-store';
import { DataSourceType } from '@app/enums/datasource-type';
import { ParseMethod } from '@app/enums/parse-method';
import { TextFormat } from '@app/enums/text-format';
import { ControlStyleService } from '@app/services/control-style.service';
import { DateTimeFormatService } from '@app/services/formatter/datetime-format.service';
import { NumberFormatService } from '@app/services/formatter/number-format.service';
import * as StyleUtil from '@app/util/style-util';
import { ComboBoxWrapper } from '@app/wrappers/combobox-wrapper';
import { FittedDataWrapper } from '@app/wrappers/fitted-data-wrapper';
import { TextBoxBaseWrapper } from '@app/wrappers/textbox-base-wrapper';
import * as Moment from 'moment-timezone';

/** Im HTML kann Text nicht einfach so measured werden, wie im Java.
 * In der Höhe ist es einfach, in der Breite nicht.
 */
@Injectable({ providedIn: 'root' })
export class FontService {

  private readonly _controlStyleService: ControlStyleService;
  private readonly _numberFormatService: NumberFormatService;
  private readonly _dateTimeFormatService: DateTimeFormatService;

  // Common constants
  private readonly _separator: string = '|';
  private readonly _measureTextFallback: string = 'WWWiniel Esrai tdhUcen IsnetLorem iPsum Dolor sitAmet consetetur SadipsciNg eliTri';
  private readonly _minWidthRasterFallback: number = 25;
  private readonly _maxWidthRasterFallback: number = 50;

  // Constants for DateTime width calculation
  private readonly _dateYear: number = 2022;
  private readonly _dateStartMonth: number = 0;
  private readonly _dateEndMonth: number = 11;
  private readonly _dateStartDay: number = 20;
  private readonly _dateEndDay: number = 26;
  private readonly _dateHours: number = 22;
  private readonly _dateMinutes: number = 57;
  private readonly _dateSeconds: number = 43;

  // Buffers for already calculated widths
  private readonly _stringWidthBuffer: Map<string, number> = new Map<string, number>();
  private readonly _stringHeightBuffer: Map<string, number> = new Map<string, number>();
  private readonly _dateTimeWidthBuffer: Map<string, number> = new Map<string, number>();
  private readonly _numberWidthBuffer: Map<string, number> = new Map<string, number>();
  private readonly _maxWidthDigitBuffer: Map<string, number> = new Map<string, number>();
  private readonly _linesHeightBuffer: Map<string, number> = new Map<string, number>();

  private readonly _span: HTMLSpanElement;
  private readonly _canvas: HTMLCanvasElement;
  private readonly _context: CanvasRenderingContext2D;

  private _baseControlStyle: PropertyStore | null = null;

  public constructor(
    controlStyleService: ControlStyleService,
    numberFormatService: NumberFormatService,
    dateTimeFormatService: DateTimeFormatService
  ) {
    this._controlStyleService = controlStyleService;
    this._numberFormatService = numberFormatService;
    this._dateTimeFormatService = dateTimeFormatService;

    const span: HTMLSpanElement | null = document.getElementById('measureHeightSpan');

    if (span == null) {
      throw new Error('Cannot find HTML element with ID \'measureHeightSpan\'');
    }

    this._span = span;

    this._canvas = document.createElement('canvas');
    // Anders als beim Span muss das canvas nicht im DOM hängen, um es verwenden zu können.
    const context: CanvasRenderingContext2D | null = this._canvas.getContext('2d');

    if (context == null) {
      throw new Error('Canvas element does not provide a 2D rendering context');
    }

    this._context = context;
  }

  private get baseControlStyle(): PropertyStore {
    if (this._baseControlStyle == null) {
      this._baseControlStyle = new PropertyStore();
      const data: PropertyData | null = this._controlStyleService.getBaseControlStyle();
      if (data != null) {
        this._baseControlStyle.setLayer(PropertyLayer.ControlStyle, data);
      }
    }

    return this._baseControlStyle;
  }

  private getMeasureText(): string {
    return this.baseControlStyle.getMeasureText() ?? this._measureTextFallback;
  }

  private getMinWidthRaster(): number {
    return this.baseControlStyle.getMinWidthRaster() ?? this._minWidthRasterFallback;
  }

  private getMaxWidthRaster(): number {
    return this.baseControlStyle.getMaxWidthRaster() ?? this._maxWidthRasterFallback;
  }

  private getMeasuredWidth(wrapper: FittedDataWrapper, type: DataSourceType, length: number, scale: number, format: TextFormat, formatPattern: string | null, raster: number): number {
    switch (type) {
      case DataSourceType.String:
        return this.getStringWidthRastered(wrapper, length, format, raster);
      case DataSourceType.DateTime:
        return this.getDateTimeWidthRastered(wrapper, format, formatPattern, raster);
      case DataSourceType.None:
        return 0;
      default:
        return this.getNumberWidthRastered(wrapper, type, scale, length, format, formatPattern, raster);
    }
  }

  private getMeasuredHeight(wrapper: FittedDataWrapper, lines: number): number {
    let bufferKey: string = this.getFontKey(wrapper);
    bufferKey = this.addKey(bufferKey, lines);

    let bufferValue: number | undefined = this._linesHeightBuffer.get(bufferKey);

    if (bufferValue == null) {
      bufferValue = this.measureLinesHeight(wrapper, lines);
      this._linesHeightBuffer.set(bufferKey, bufferValue);
    }
    return Number.zeroIfNull(bufferValue);
  }

  private getRasteredValue(value: number, raster: number): number {
    const rasterPos: number = Math.round(value / raster);

    if (rasterPos * raster === value) {
      return value;
    }

    return (rasterPos + 1) * raster;
  }

  private getMaxWidthDigit(wrapper: FittedDataWrapper): number {
    const bufferKey: string = this.getFontKey(wrapper);
    let bufferedValue: number | undefined = this._maxWidthDigitBuffer.get(bufferKey);

    if (bufferedValue == null) {
      let digit: number = 0;
      let maxDigitWidth: number = 0;
      const fontFamily: string = wrapper.getFontFamily();
      const fontSize: number = wrapper.getFontSize();
      const fontBold: boolean = wrapper.getFontBold();
      const fontItalic: boolean = wrapper.getFontItalic();

      for (let i = 9; i >= 0; i--) {
        const digitStr: string = i.toString();

        /*
         * Measure 3 of the same digits behind each other because of a weird measuring behavior:
         * '1' is the same width as '6' but '111' is not as wide as '666' -> WTF?
         */
        const measureText: string = digitStr + digitStr + digitStr;
        const digitWidth: number = this.measureTextWidth(measureText, fontFamily, fontSize, fontBold, fontItalic) / 3;
        if (digitWidth > maxDigitWidth || digitWidth === maxDigitWidth && digit === 0) {
          digit = i;
          maxDigitWidth = digitWidth;
        }
      }

      bufferedValue = digit;
      this._maxWidthDigitBuffer.set(bufferKey, bufferedValue);
    }
    return Number.zeroIfNull(bufferedValue);
  }

  private getFontKey(wrapper: FittedDataWrapper): string {
    return wrapper.getFontFamily() + this._separator + wrapper.getFontSize().toString() + this._separator + wrapper.getFontBold().toString();
  }

  private addKey(key: string, value: any): string {
    const valueStr: string = value == null ? String.empty() : value.toString();
    return key + this._separator + valueStr;
  }

  private getStringWidthRastered(wrapper: FittedDataWrapper, length: number, format: TextFormat, raster: number): number {
    if (length <= 0) {
      return raster;
    }

    let bufferKey: string = this.getFontKey(wrapper);
    bufferKey = this.addKey(bufferKey, length);
    bufferKey = this.addKey(bufferKey, format);
    bufferKey = this.addKey(bufferKey, raster);

    let bufferValue: number | undefined = this._stringWidthBuffer.get(bufferKey);

    if (bufferValue == null) {
      bufferValue = this.getRasteredValue(this.measureStringWidth(wrapper, length, format), raster);
      this._stringWidthBuffer.set(bufferKey, bufferValue);
    }

    return Number.zeroIfNull(bufferValue);
  }

  private getDateTimeWidthRastered(wrapper: FittedDataWrapper, format: TextFormat, formatPattern: string | null, raster: number): number {
    let bufferKey: string = this.getFontKey(wrapper);
    bufferKey = this.addKey(bufferKey, format);
    bufferKey = this.addKey(bufferKey, formatPattern);
    bufferKey = this.addKey(bufferKey, raster);

    let bufferValue: number | undefined = this._dateTimeWidthBuffer.get(bufferKey);

    if (bufferValue == null) {
      bufferValue = this.getRasteredValue(this.measureDateTimeWidth(wrapper, format, formatPattern), raster);
      this._dateTimeWidthBuffer.set(bufferKey, bufferValue);
    }

    return Number.zeroIfNull(bufferValue);
  }

  private getNumberWidthRastered(wrapper: FittedDataWrapper, type: DataSourceType, scale: number,
    precision: number, format: TextFormat, formatPattern: string | null, raster: number): number {

    let bufferKey: string = this.getFontKey(wrapper);
    bufferKey = this.addKey(bufferKey, type);
    bufferKey = this.addKey(bufferKey, scale);
    bufferKey = this.addKey(bufferKey, precision);
    bufferKey = this.addKey(bufferKey, format);
    bufferKey = this.addKey(bufferKey, formatPattern);
    bufferKey = this.addKey(bufferKey, raster);

    let bufferValue: number | undefined = this._numberWidthBuffer.get(bufferKey);

    if (bufferValue == null) {
      bufferValue = this.getRasteredValue(this.measureNumberWidth(wrapper, type, scale, precision, format, formatPattern), raster);
      this._numberWidthBuffer.set(bufferKey, bufferValue);
    }

    return Number.zeroIfNull(bufferValue);
  }

  private measureLinesHeight(wrapper: FittedDataWrapper, lines: number): number {
    const lineHeight: number = wrapper.getLineHeight();
    return lineHeight * lines;
  }

  private measureStringWidth(wrapper: FittedDataWrapper, length: number, format: TextFormat): number {
    // 1. Get the measure text and either cut to desired length or determine the factor that is needed to achieve the desired length
    let factor: number = 1;
    let measureText: string = this.getMeasureText();

    if (length > measureText.length) {
      factor = length / measureText.length;
    } else {
      measureText = measureText.substring(0, length);
    }

    // 2. Consider format (uppercase/lowercase)
    switch (format) {
      case TextFormat.UpperCase:
        measureText = measureText.toUpperCase();
        break;
      case TextFormat.LowerCase:
        measureText = measureText.toLowerCase();
        break;
      default:
        break;
    }

    // 3. Calculate width of measure text and multiply with factor
    const fontFamily: string = wrapper.getFontFamily();
    const fontSize: number = wrapper.getFontSize();
    const fontBold: boolean = wrapper.getFontBold();
    const fontItalic: boolean = wrapper.getFontItalic();

    const measureTextWidth: number = this.measureTextWidth(measureText, fontFamily, fontSize, fontBold, fontItalic);

    return measureTextWidth * factor;
  }

  private measureDateTimeWidth(wrapper: FittedDataWrapper, textFormat: TextFormat, formatPattern: string | null): number {
    let result: number = 0;

    const fontFamily: string = wrapper.getFontFamily();
    const fontSize: number = wrapper.getFontSize();
    const fontBold: boolean = wrapper.getFontBold();
    const fontItalic: boolean = wrapper.getFontItalic();

    for (let month = this._dateStartMonth; month <= this._dateEndMonth; month++) {
      for (let day = this._dateStartDay; day <= this._dateEndDay; day++) {
        const date: Moment.Moment = Moment({
          year: this._dateYear,
          month,
          day,
          hours: this._dateHours,
          minutes: this._dateMinutes,
          seconds: this._dateSeconds
        });

        const measureString: string | null = this._dateTimeFormatService.formatDate(date, textFormat, formatPattern);

        result = Math.max(result, this.measureTextWidth(measureString, fontFamily, fontSize, fontBold, fontItalic));
      }
    }

    return result;
  }

  private measureNumberWidth(wrapper: FittedDataWrapper, type: DataSourceType, scale: number,
    precision: number, textFormat: TextFormat, formatPattern: string | null): number {

    const maxWidthDigit: number = this.getMaxWidthDigit(wrapper);
    let value: string = String.empty();

    switch (type) {
      case DataSourceType.Byte:
      case DataSourceType.Int:
      case DataSourceType.Long:
      case DataSourceType.Short:
        let intValue: number = maxWidthDigit === 0 ? -9 : -maxWidthDigit;
        for (let i = 1; i < precision - scale; i++) {
          intValue = intValue * 10 - maxWidthDigit;
        }
        value += intValue;
        break;

      default:
        let digits: number = maxWidthDigit === 0 ? -9 : maxWidthDigit * -1;
        for (let i = 1; i < precision - scale; i++) {
          digits = digits * 10 - maxWidthDigit;
        }

        value += `${digits}.`;

        if (scale > 0) {
          let decimals: number = maxWidthDigit === 0 ? 9 : maxWidthDigit;
          for (let i = 1; i < scale; i++) {
            decimals = decimals * 10 + maxWidthDigit;
          }
          value += decimals;
        } else {
          value += maxWidthDigit;
        }
        break;
    }

    const measureString: string | null = this._numberFormatService.formatString(value, ParseMethod.Server, textFormat, formatPattern);

    const fontFamily: string = wrapper.getFontFamily();
    const fontSize: number = wrapper.getFontSize();
    const fontBold: boolean = wrapper.getFontBold();
    const fontItalic: boolean = wrapper.getFontItalic();

    return this.measureTextWidth(measureString, fontFamily, fontSize, fontBold, fontItalic);
  }

  public getDataMinWidthTextBox(wrapper: TextBoxBaseWrapper): number {
    return this.getMeasuredWidth(wrapper, wrapper.getDataSourceType(), wrapper.getDisplayMinLength(),
      wrapper.getMaxScale(), wrapper.getFormat(), wrapper.getFormatPattern(), this.getMinWidthRaster());
  }

  public getDataMaxWidthTextBox(wrapper: TextBoxBaseWrapper): number {
    return this.getMeasuredWidth(wrapper, wrapper.getDataSourceType(), wrapper.getDisplayMaxLength(),
      wrapper.getMaxScale(), wrapper.getFormat(), wrapper.getFormatPattern(), this.getMaxWidthRaster());
  }

  public getDataMinHeightTextBox(wrapper: TextBoxBaseWrapper): number {
    return this.getMeasuredHeight(wrapper, wrapper.getDisplayMinLines());
  }

  public getDataMaxHeightTextBox(wrapper: TextBoxBaseWrapper): number {
    return this.getMeasuredHeight(wrapper, wrapper.getDisplayMaxLines());
  }

  public getDataMinWidthComboBox(wrapper: ComboBoxWrapper): number {
    return this.getMeasuredWidth(wrapper, wrapper.getListType(), wrapper.getListDisplayMinLength(), 0, TextFormat.None, null, this.getMinWidthRaster());
  }

  public getDataMaxWidthComboBox(wrapper: ComboBoxWrapper): number {
    return this.getMeasuredWidth(wrapper, wrapper.getListType(), wrapper.getListDisplayMaxLength(), 0, TextFormat.None, null, this.getMaxWidthRaster());
  }

  /** Über ein erstelltes Canvas-HTML Element wird die Breite des Textes gemessen. */
  public measureTextWidth(text: string | null, font: string, size: number, isBold: boolean, isItalic: boolean): number {
    if (text == null || font.trim().length === 0 || size <= 0) {
      return 0;
    }

    this._context.font = `${(isBold ? 'bold' : String.empty()) + (isItalic ? ' italic' : String.empty())} ${size}px ${font}`;

    return Math.ceilDec(this._context.measureText(text).width, 0);
  }

  /** Misst anhand des <span id="measureHeightSpan" ...> in der index.html die Höhe
   * des Textes.
   * Die FontFamily und Size wird gesetzt und anhand des gesetzten Wertes wird die Höhe gemessen.*/
  public measureTextHeight(font: string, size: number): number {
    if (font.trim().length === 0 || size <= 0) {
      return 0;
    }

    const fontKey: string = font + this._separator + size.toString();

    let bufferedHeight: number | undefined = this._stringHeightBuffer.get(fontKey);

    if (bufferedHeight == null) {
      this._span.style.fontFamily = font;
      this._span.style.fontSize = StyleUtil.pixToRemValueStr(size);

      bufferedHeight = Math.ceilDec(this._span.offsetHeight, 0);

      this._stringHeightBuffer.set(fontKey, bufferedHeight);
    }

    return bufferedHeight;
  }
}

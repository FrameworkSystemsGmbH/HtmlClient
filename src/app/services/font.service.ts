import { Injectable } from '@angular/core';
import * as Moment from 'moment-timezone';

import { ControlStyleService } from './control-style.service';
import { NumberFormatService } from './formatter/number-format.service';
import { DateTimeFormatService } from './formatter/datetime-format.service';
import { PropertyStore, PropertyLayer } from '../common';
import { TextBoxBaseWrapper } from '../wrappers/textbox-base-wrapper';
import { BaseWrapperFittedData } from '../wrappers/base-wrapper-fitted-data';
import { DataSourceType, TextFormat } from '../enums';

export interface IFontService {
  getDataMinWidthTextBox(wrapper: TextBoxBaseWrapper): number;
  getDataMaxWidthTextBox(wrapper: TextBoxBaseWrapper): number;
  getDataMinHeightTextBox(wrapper: TextBoxBaseWrapper): number;
  getDataMaxHeightTextBox(wrapper: TextBoxBaseWrapper): number;
  measureText(text: string, font: string, size: number, isBold: boolean, isItalic: boolean): number;
}

@Injectable()
export class FontService implements IFontService {

  // Common constants
  private readonly separator: string = '|';

  // Constants for DateTime width calculation
  private readonly date_year: number = 2022;
  private readonly date_start_month: number = 0;
  private readonly date_end_month: number = 11;
  private readonly date_start_day: number = 20;
  private readonly date_end_day: number = 26;
  private readonly date_hours: number = 22;
  private readonly date_minutes: number = 57;
  private readonly date_seconds: number = 43;

  // Buffers for already calculated widths
  private readonly stringWidthBuffer: Map<String, number> = new Map<String, number>();
  private readonly dateTimeWidthBuffer: Map<String, number> = new Map<String, number>();
  private readonly numberWidthBuffer: Map<String, number> = new Map<String, number>();
  private readonly maxWidthDigitBuffer: Map<String, number> = new Map<String, number>();
  private readonly linesHeightBuffer: Map<String, number> = new Map<String, number>();

  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;

  private baseControlStyle: PropertyStore;

  constructor(
    private controlStyleService: ControlStyleService,
    private numberFormatService: NumberFormatService,
    private dateTimeFormatService: DateTimeFormatService) {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
  }

  private initBaseControlStyle(): void {
    if (!this.baseControlStyle) {
      this.baseControlStyle = new PropertyStore();
      this.baseControlStyle.setLayer(PropertyLayer.ControlStyle, this.controlStyleService.getBaseControlStyle());
    }
  }

  private getMeasureText(): string {
    this.initBaseControlStyle();
    return this.baseControlStyle.getMeasureText();
  }

  private getMinWidthRaster(): number {
    this.initBaseControlStyle();
    return this.baseControlStyle.getMinWidthRaster();
  }

  private getMaxWidthRaster(): number {
    this.initBaseControlStyle();
    return this.baseControlStyle.getMaxWidthRaster();
  }

  private getMeasuredWidth(wrapper: BaseWrapperFittedData, type: DataSourceType, length: number, scale: number,
    format: TextFormat, formatPattern: string, raster: number): number {
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

  private getMeasuredHeight(wrapper: BaseWrapperFittedData, lines: number): number {
    let bufferKey: string = this.getFontKey(wrapper);
    bufferKey = this.addKey(bufferKey, lines);

    let bufferValue: number = this.linesHeightBuffer.get(bufferKey);

    if (bufferValue == null) {
      bufferValue = this.measureLinesHeight(wrapper, lines);
      this.linesHeightBuffer.set(bufferKey, bufferValue);
    }
    return Number.zeroIfNull(bufferValue);
  }

  private getRasteredValue(value: number, raster: number): number {
    if (raster == null) {
      return value;
    } else {
      let rasterPos: number = Math.round(value / raster);

      if (rasterPos * raster === value) {
        return value;
      }

      return (rasterPos + 1) * raster;
    }
  }

  private getMaxWidthDigit(wrapper: BaseWrapperFittedData): number {
    let bufferKey: string = this.getFontKey(wrapper);
    let bufferedValue: number = this.maxWidthDigitBuffer.get(bufferKey);

    if (bufferedValue == null) {
      let digit: number = 0;
      let maxDigitWidth: number = 0;
      let fontFamily: string = wrapper.getFontFamily();
      let fontSize: number = wrapper.getFontSize();
      let fontBold: boolean = wrapper.getFontBold();
      let fontItalic: boolean = wrapper.getFontItalic();

      for (let i = 9; i >= 0; i--) {
        let digitStr: string = i.toString();
        // Measure 3 of the same digits behind each other because of a weird measuring behavior:
        // '1' is the same width as '6' but '111' is not as wide as '666' -> WTF?
        let measureText: string = digitStr + digitStr + digitStr;
        let digitWidth: number = this.measureText(measureText, fontFamily, fontSize, fontBold, fontItalic) / 3;
        if (digitWidth > maxDigitWidth || digitWidth === maxDigitWidth && digit === 0) {
          digit = i;
          maxDigitWidth = digitWidth;
        }
      }

      bufferedValue = digit;
      this.maxWidthDigitBuffer.set(bufferKey, bufferedValue);
    }
    return Number.zeroIfNull(bufferedValue);
  }

  private getFontKey(wrapper: BaseWrapperFittedData): string {
    return wrapper.getFontFamily() + this.separator + wrapper.getFontSize() + this.separator + wrapper.getFontBold();
  }

  private addKey(key: string, value: any): string {
    return key + this.separator + (value == null ? '' : value.toString());
  }



  private getStringWidthRastered(wrapper: BaseWrapperFittedData, length: number, format: TextFormat, raster: number): number {
    if (length == null || length <= 0) {
      return raster;
    }

    let bufferKey: string = this.getFontKey(wrapper);
    bufferKey = this.addKey(bufferKey, length);
    bufferKey = this.addKey(bufferKey, format);
    bufferKey = this.addKey(bufferKey, raster);

    let bufferValue: number = this.stringWidthBuffer.get(bufferKey);

    if (bufferValue == null) {
      bufferValue = this.getRasteredValue(this.measureStringWidth(wrapper, length, format), raster);
      this.stringWidthBuffer.set(bufferKey, bufferValue);
    }

    return Number.zeroIfNull(bufferValue);
  }

  private getDateTimeWidthRastered(wrapper: BaseWrapperFittedData, format: TextFormat, formatPattern: string, raster: number): number {
    let bufferKey: string = this.getFontKey(wrapper);
    bufferKey = this.addKey(bufferKey, format);
    bufferKey = this.addKey(bufferKey, formatPattern);
    bufferKey = this.addKey(bufferKey, raster);

    let bufferValue: number = this.dateTimeWidthBuffer.get(bufferKey);

    if (bufferValue == null) {
      bufferValue = this.getRasteredValue(this.measureDateTimeWidth(wrapper, format, formatPattern), raster);
      this.dateTimeWidthBuffer.set(bufferKey, bufferValue);
    }

    return Number.zeroIfNull(bufferValue);
  }

  private getNumberWidthRastered(wrapper: BaseWrapperFittedData, type: DataSourceType, scale: number,
    precision: number, format: TextFormat, formatPattern: string, raster: number): number {

    let bufferKey: string = this.getFontKey(wrapper);
    bufferKey = this.addKey(bufferKey, type);
    bufferKey = this.addKey(bufferKey, scale);
    bufferKey = this.addKey(bufferKey, precision);
    bufferKey = this.addKey(bufferKey, format);
    bufferKey = this.addKey(bufferKey, formatPattern);
    bufferKey = this.addKey(bufferKey, raster);

    let bufferValue: number = this.numberWidthBuffer.get(bufferKey);

    if (bufferValue == null) {
      bufferValue = this.getRasteredValue(this.measureNumberWidth(wrapper, type, scale, precision, format, formatPattern), raster);
      this.numberWidthBuffer.set(bufferKey, bufferValue);
    }

    return Number.zeroIfNull(bufferValue);
  }


  private measureLinesHeight(wrapper: BaseWrapperFittedData, lines: number): number {
    let fontSize: number = wrapper.getFontSize();
    return fontSize * lines;
  }


  private measureStringWidth(wrapper: BaseWrapperFittedData, length: number, format: TextFormat) {
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
    let fontFamily: string = wrapper.getFontFamily();
    let fontSize: number = wrapper.getFontSize();
    let fontBold: boolean = wrapper.getFontBold();
    let fontItalic: boolean = wrapper.getFontItalic();

    let measureTextWidth: number = this.measureText(measureText, fontFamily, fontSize, fontBold, fontItalic);

    return measureTextWidth * factor;
  }

  private measureDateTimeWidth(wrapper: BaseWrapperFittedData, textFormat: TextFormat, formatPattern: string): number {
    let result: number = 0;

    let fontFamily: string = wrapper.getFontFamily();
    let fontSize: number = wrapper.getFontSize();
    let fontBold: boolean = wrapper.getFontBold();
    let fontItalic: boolean = wrapper.getFontItalic();

    for (let month = this.date_start_month; month <= this.date_end_month; month++) {
      for (let day = this.date_start_day; day <= this.date_end_day; day++) {
        let date: Moment.Moment = Moment({
          year: this.date_year,
          month: month,
          day: day,
          hours: this.date_hours,
          minutes: this.date_minutes,
          seconds: this.date_seconds
        });

        let measureString: string = this.dateTimeFormatService.formatDate(date, textFormat, formatPattern);

        result = Math.max(result, this.measureText(measureString, fontFamily, fontSize, fontBold, fontItalic));
      }
    }
    return result;
  }

  private measureNumberWidth(wrapper: BaseWrapperFittedData, type: DataSourceType, scale: number,
    precision: number, textFormat: TextFormat, formatPattern: string): number {

    let maxWidthDigit: number = this.getMaxWidthDigit(wrapper);
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

        value += digits + '.';

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

    let measureString: string = this.numberFormatService.formatString(value, textFormat, formatPattern);

    let fontFamily: string = wrapper.getFontFamily();
    let fontSize: number = wrapper.getFontSize();
    let fontBold: boolean = wrapper.getFontBold();
    let fontItalic: boolean = wrapper.getFontItalic();

    return this.measureText(measureString, fontFamily, fontSize, fontBold, fontItalic);
  }

  public getDataMinWidthTextBox(wrapper: TextBoxBaseWrapper): number {
    return this.getMeasuredWidth(wrapper, wrapper.getDataSourceType(), wrapper.getDisplayMinLength(),
      wrapper.getMaxScale(), wrapper.getFormat(), wrapper.getFormatPattern(), this.getMinWidthRaster());
  }

  // public getMeasuredMinWidthComboBox(wrapper: ComboBoxWrapper): number {
  //   DevProperties devProperties = uiCombobox.GetDevProperties();
  //   return getMeasuredWidthUs(uiCombobox, devProperties.getListType(), devProperties.getListDisplayMinLength(),
  //     devProperties.getListMaxScale(), devProperties.getListFormat(),
  //     devProperties.getListFormatPattern(), getMinWidthRasterUs());
  // }

  // public getMeasuredMinWidthListBox(wrapper: ListBoxWrapper): number {
  //   DevProperties devProperties = uiList.GetDevProperties();
  //   return getMeasuredWidthUs(uiList, devProperties.getListType(), devProperties.getListDisplayMinLength(),
  //     devProperties.getListMaxScale(), devProperties.getListFormat(),
  //     devProperties.getListFormatPattern(), getMinWidthRasterUs());
  // }

  public getDataMaxWidthTextBox(wrapper: TextBoxBaseWrapper): number {
    return this.getMeasuredWidth(wrapper, wrapper.getDataSourceType(), wrapper.getDisplayMaxLength(),
      wrapper.getMaxScale(), wrapper.getFormat(), wrapper.getFormatPattern(), this.getMaxWidthRaster());
  }

  // public getMeasuredMaxWidthComboBox(wrapper: ComboBoxWrapper): number {
  //   DevProperties devProperties = uiCombobox.GetDevProperties();
  //   return getMeasuredWidthUs(uiCombobox, devProperties.getListType(), devProperties.getListDisplayMaxLength(), devProperties.getListMaxScale()
  //     , devProperties.getListFormat(), devProperties.getListFormatPattern(),
  //     getMaxWidthRasterUs());
  // }

  // public getMeasuredMaxWidthListBox(wrapper: ListBoxWrapper): number {
  //   DevProperties devProperties = uiList.GetDevProperties();
  //   return getMeasuredWidthUs(uiList, devProperties.getListType(), devProperties.getListDisplayMaxLength(), devProperties.getListMaxScale()
  //     , devProperties.getListFormat(), devProperties.getListFormatPattern(),
  //     getMaxWidthRasterUs());
  // }

  public getDataMinHeightTextBox(wrapper: TextBoxBaseWrapper): number {
    return this.getMeasuredHeight(wrapper, wrapper.getDisplayMinLines());
  }

  public getDataMaxHeightTextBox(wrapper: TextBoxBaseWrapper): number {
    return this.getMeasuredHeight(wrapper, wrapper.getDisplayMaxLines());
  }


  // public getMeasuredMinWidth(UIJideTable uiTable, ColDesc colDesc): number {
  //   DevProperties devProperties = colDesc.getProperties();
  //   int width = colDesc.Caption() != null ? colDesc.Caption().length() : 0;
  //   return getMeasuredWidthUs(uiTable, colDesc.ColumnType(), Math.max(width, colDesc.DisplayMinLength()),
  //     devProperties.getMaxScale(), devProperties.getFormat(),
  //     devProperties.getFormatPattern(), null);
  // }

  public measureText(text: string, font: string, size: number, isBold: boolean, isItalic: boolean): number {
    if (!text) {
      return 0;
    } else {
      this.context.font = (isBold ? 'bold' : String.empty()) + (isItalic ? ' italic' : String.empty()) + ' ' + size + 'px' + ' ' + font;
      return this.context.measureText(text).width;
    }
  }
}

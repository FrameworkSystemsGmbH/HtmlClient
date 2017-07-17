import { Injectable } from '@angular/core';

import { PropertyStore, PropertyLayer, PropertyData } from '../common';
import { ControlStyleService } from './control-style.service';
import { TextBoxBaseWrapper, BaseWrapperFittedData } from '../wrappers';
import { DataSourceType, TextFormat } from '../enums';

@Injectable()
export class FontService {

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
  private readonly baseControlStyle: PropertyStore;

  constructor(private controlStyleService: ControlStyleService) {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.baseControlStyle = new PropertyStore();
    this.baseControlStyle.setLayer(PropertyLayer.ControlStyle, this.controlStyleService.getBaseControlStyle());
  }

  private getMeasureText(): string {
    return this.baseControlStyle.getMeasureText();
  }

  private getMinWidthRaster(): number {
    return this.baseControlStyle.getMinWidthRaster();
  }

  private getMaxWidthRaster(): number {
    return this.baseControlStyle.getMaxWidthRaster();
  }

  private getMeasuredWidth(wrapper: BaseWrapperFittedData, type: DataSourceType, lenght: number, scale: number,
    format: TextFormat, formatPattern: string, raster: number): number {
    switch (type) {
      case DataSourceType.String:
        return this.getStringWidthRastered(wrapper, lenght, format, raster);
      case DataSourceType.DateTime:
        return this.getDateTimeWidthRastered(wrapper, format, formatPattern, raster);
      case DataSourceType.None:
        return 0;
      default:
        return this.getNumberWidthRastered(wrapper, type, scale, lenght, format, formatPattern, raster);
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
      let rasterPos: number = (value / raster);

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

      for (let i = 0; i <= 9; i++) {
        let digitWidth: number = this.measureText(i.toString(), fontFamily, fontSize, fontBold, fontItalic);
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

  private measureDateTimeWidth(wrapper: BaseWrapperFittedData, format: TextFormat, formatPattern: string): number {
    let result: number = 0;

    let fontFamily: string = wrapper.getFontFamily();
    let fontSize: number = wrapper.getFontSize();
    let fontBold: boolean = wrapper.getFontBold();
    let fontItalic: boolean = wrapper.getFontItalic();

    for (let month = this.date_start_month; month <= this.date_end_month; month++) {
      for (let day = this.date_start_day; day <= this.date_end_day; day++) {
        let dt: Date = new Date(this.date_year, month, day, this.date_hours, this.date_minutes, this.date_seconds);
        let measureString: string = dt.toDateString();
        // #warning let measureString: string = FrameworkFormatMask.ToFormattedString(dt, format, formatPattern, 0, DotNetTypes.DateTime);
        result = Math.max(result, this.measureText(measureString, fontFamily, fontSize, fontBold, fontItalic));
      }
    }
    return result;
  }

  private measureNumberWidth(wrapper: BaseWrapperFittedData, type: DataSourceType, scale: number,
    precision: number, format: TextFormat, formatPattern: string): number {

    let maxWidthDigit: number = this.getMaxWidthDigit(wrapper);
    let value: any;

    switch (type) {
      case DataSourceType.Byte:
      case DataSourceType.Int:
      case DataSourceType.Long:
      case DataSourceType.Short:
        let lngValue: number = maxWidthDigit === 0 ? -9 : -maxWidthDigit;
        for (let i = 1; i < precision - scale; i++) {
          lngValue = lngValue * 10 - maxWidthDigit;
        }
        value = lngValue;
        break;

      default:
        let dblValue: number = maxWidthDigit === 0 ? -9.0 : maxWidthDigit * -1.0;
        for (let i = 1; i < precision - scale; i++) {
          dblValue = dblValue * 10.0 - maxWidthDigit;
        }

        if (scale > 0) {
          let scaleValue: number = maxWidthDigit === 0 ? 9 : maxWidthDigit;
          for (let i = 1; i < scale; i++) {
            scaleValue = scaleValue * 10 + maxWidthDigit;
          }
          dblValue = dblValue - (scaleValue / 10 ^ scale);
        }

        value = dblValue;
        break;
    }

    let measureString: string = value.toString();
    // #warning String measureString = FrameworkFormatMask.ToFormattedString(value, format, formatPattern, scale, type);

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

import { TextFormat } from 'app/enums/text-format';

export class TemplateControlValueWrapper {

  private _value: string;
  private _format: TextFormat;
  private _formatPattern: string;

  constructor(value: string, format: TextFormat, formatPattern: string) {
    this._value = value;
    this._format = format;
    this._formatPattern = formatPattern;
  }

  public getValue(): string {
    return this._value;
  }

  public getFormat(): TextFormat {
    return this._format;
  }

  public getFormatPattern(): string {
    return this._formatPattern;
  }
}

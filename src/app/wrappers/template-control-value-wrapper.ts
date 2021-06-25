import { TextFormat } from '@app/enums/text-format';

export class TemplateControlValueWrapper {

  private readonly _value: string;
  private readonly _format: TextFormat;
  private readonly _formatPattern: string;

  public constructor(value: string, format: TextFormat, formatPattern: string) {
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

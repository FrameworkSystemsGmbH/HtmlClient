import { TextFormat } from '@app/enums/text-format';

export class ListViewItemValueWrapper {

  private readonly _value: string | null;
  private readonly _format: TextFormat = TextFormat.None;
  private readonly _formatPattern: string | null;

  public constructor(value: string | null, format: TextFormat, formatPattern: string | null) {
    this._value = value;
    this._format = format;
    this._formatPattern = formatPattern;
  }

  public getValue(): string | null {
    return this._value;
  }

  public getFormat(): TextFormat {
    return this._format;
  }

  public getFormatPattern(): string | null {
    return this._formatPattern;
  }
}

import { TextFormat } from '../../enums/text-format';

export interface IStringFormatService {
  formatString(value: string, textFormat: TextFormat): string;
}

export class StringFormatService implements IStringFormatService {

  public formatString(value: string, textFormat: TextFormat): string {
    switch (textFormat) {
      case TextFormat.LowerCase:
        return value ? value.toLowerCase() : value;
      case TextFormat.UpperCase:
        return value ? value.toUpperCase() : value;
      default:
        return value;
    }
  }
}

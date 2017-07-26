import { Injectable } from '@angular/core';
import { TextFormat } from '../enums';

@Injectable()
export class FormatService {

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

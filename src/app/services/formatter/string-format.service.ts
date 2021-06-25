import { Injectable } from '@angular/core';
import { TextFormat } from '@app/enums/text-format';

@Injectable({ providedIn: 'root' })
export class StringFormatService {

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

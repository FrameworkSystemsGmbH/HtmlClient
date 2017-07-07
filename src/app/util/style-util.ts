import { HorizontalAlignment, TextAlign } from '../enums';

export class StyleUtil {

  public static getValuePx(value: string | number): string {
    return (value ? value : 0) + 'px';
  }

  public static getFontWeight(bold: boolean): string {
    return bold ? 'bold' : 'normal';
  }

  public static getFontStyle(italic: boolean): string {
    return italic ? 'italic' : 'normal';
  }

  public static getTextDecoration(underline: boolean): string {
    return underline ? 'underline' : 'unset';
  }

  public static getTextAlign(textAlign: TextAlign): string {
    switch (textAlign) {
      case TextAlign.Left:
        return 'left';
      case TextAlign.Center:
        return 'center';
      case TextAlign.Right:
        return 'right';
      default:
        return 'center';
    }
  }

}

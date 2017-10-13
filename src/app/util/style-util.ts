import { TextAlign } from '../enums/text-align';
import { ContentAlignment } from '../enums/content-alignment';

export class StyleUtil {

  public static getValue(unit: string, value: number): string {
    return Number.zeroIfNull(value) + unit;
  }

  public static getFourValue(unit: string, first: number, second: number, third: number, fourth: number): string {
    return StyleUtil.getValue(unit, first) + ' ' + StyleUtil.getValue(unit, second) + ' ' + StyleUtil.getValue(unit, third) + ' ' + StyleUtil.getValue(unit, fourth);
  }

  public static getForeColor(isEditable: boolean, color: string): string {
    return isEditable ? color : '#707070';
  }

  public static getBackgroundColor(isEditable: boolean, color: string): string {
    return isEditable ? color : '#E8E8E8';
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
        return 'left';
    }
  }

  public static getCaptionAlignStyles(captionAlign: ContentAlignment, paddingLeft: number, paddingTop: number, paddingRight: number, paddingBottom: number): any {
    const styles: any = {};

    switch (captionAlign) {
      case ContentAlignment.TopLeft:
        styles['top.px'] = Number.zeroIfNull(paddingTop);
        styles['left.px'] = Number.zeroIfNull(paddingLeft);
        break;
      case ContentAlignment.TopCenter:
        styles['top.px'] = Number.zeroIfNull(paddingTop);
        styles['left'] = '50%';
        styles['transform'] = 'translateX(-50%)';
        break;
      case ContentAlignment.TopRight:
        styles['top.px'] = Number.zeroIfNull(paddingTop);
        styles['right.px'] = Number.zeroIfNull(paddingRight);
        break;
      case ContentAlignment.MiddleLeft:
        styles['top'] = '50%';
        styles['left.px'] = Number.zeroIfNull(paddingLeft);
        styles['transform'] = 'translateY(-50%)';
        break;
      case ContentAlignment.MiddleCenter:
        styles['top'] = '50%';
        styles['left'] = '50%';
        styles['transform'] = 'translate(-50%, -50%)';
        break;
      case ContentAlignment.MiddleRight:
        styles['top.px'] = '50%';
        styles['right.px'] = Number.zeroIfNull(paddingRight);
        styles['transform'] = 'translateY(-50%)';
        break;
      case ContentAlignment.BottomLeft:
        styles['bottom.px'] = Number.zeroIfNull(paddingBottom);
        styles['left.px'] = Number.zeroIfNull(paddingLeft);
        break;
      case ContentAlignment.BottomCenter:
        styles['bottom.px'] = Number.zeroIfNull(paddingBottom);
        styles['left'] = '50%';
        styles['transform'] = 'translateX(-50%)';
        break;
      case ContentAlignment.BottomRight:
        styles['bottom.px'] = Number.zeroIfNull(paddingBottom);
        styles['right.px'] = Number.zeroIfNull(paddingRight);
        break;
    }

    return styles;
  }
}

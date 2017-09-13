import { TextAlign, ContentAlignment } from '../enums';

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
        return 'left';
    }
  }

  public static getCaptionAlignStyles(captionAlign: ContentAlignment, paddingLeft: number, paddingTop: number, paddingRight: number, paddingBottom: number): any {
    const styles: any = {};

    switch (captionAlign) {
      case ContentAlignment.TopLeft:
        styles['top.px'] = paddingTop;
        styles['left.px'] = paddingLeft;
        break;
      case ContentAlignment.TopCenter:
        styles['top.px'] = paddingTop;
        styles['left'] = '50%';
        styles['transform'] = 'translateX(-50%)';
        break;
      case ContentAlignment.TopRight:
        styles['top.px'] = paddingTop;
        styles['right.px'] = paddingRight;
        break;
      case ContentAlignment.MiddleLeft:
        styles['top'] = '50%';
        styles['left.px'] = paddingLeft;
        styles['transform'] = 'translateY(-50%)';
        break;
      case ContentAlignment.MiddleCenter:
        styles['top'] = '50%';
        styles['left'] = '50%';
        styles['transform'] = 'translate(-50%, -50%)';
        break;
      case ContentAlignment.MiddleRight:
        styles['top.px'] = '50%';
        styles['right.px'] = paddingRight;
        styles['transform'] = 'translateY(-50%)';
        break;
      case ContentAlignment.BottomLeft:
        styles['bottom.px'] = paddingBottom;
        styles['left.px'] = paddingLeft;
        break;
      case ContentAlignment.BottomCenter:
        styles['bottom.px'] = paddingBottom;
        styles['left'] = '50%';
        styles['transform'] = 'translateX(-50%)';
        break;
      case ContentAlignment.BottomRight:
        styles['bottom.px'] = paddingBottom;
        styles['right.px'] = paddingRight;
        break;
    }

    return styles;
  }
}

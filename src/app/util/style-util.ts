import { TextAlign } from 'app/enums/text-align';
import { ContentAlignment } from 'app/enums/content-alignment';
import { ScrollBars } from 'app/enums/scrollbars';

export namespace StyleUtil {

  export const headerHeight: number = 40;
  export const iosMenubarHeight: number = 20;

  export function getValue(unit: string, value: number): string {
    return Number.zeroIfNull(value) + unit;
  }

  export function getFourValue(unit: string, first: number, second: number, third: number, fourth: number): string {
    return getValue(unit, first) + ' ' + getValue(unit, second) + ' ' + getValue(unit, third) + ' ' + getValue(unit, fourth);
  }

  export function getForeColor(isEditable: boolean, color: string): string {
    return isEditable ? color : '#333333';
  }

  export function getBackgroundColor(color: string, isEditable: boolean): string {
    return isEditable ? color : '#E8E8E8';
  }

  export function getBackgroundColorTextInput(color: string, isEditable: boolean, isFocused: boolean): string {
    if (isFocused) {
      return '#FFFFE1';
    } else if (!isEditable) {
      return '#E8E8E8';
    } else {
      return color;
    }
  }

  export function getFontWeight(bold: boolean): string {
    return bold ? 'bold' : 'normal';
  }

  export function getFontStyle(italic: boolean): string {
    return italic ? 'italic' : 'normal';
  }

  export function getTextDecoration(underline: boolean): string {
    return underline ? 'underline' : 'unset';
  }

  export function getTextAlign(textAlign: TextAlign): string {
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

  export function getWordWrap(wordWrap: boolean): string {
    return wordWrap ? 'break-word' : 'normal';
  }

  export function getWhiteSpace(wordWrap: boolean): string {
    return wordWrap ? 'pre-wrap' : 'pre';
  }

  export function getOverflowX(scrollBars: ScrollBars, wordWrap?: boolean): string {
    switch (scrollBars) {
      case ScrollBars.Both:
      case ScrollBars.Horizontal:
        return wordWrap === true ? 'hidden' : 'auto';
      default:
        return 'hidden';
    }
  }

  export function getOverflowY(scrollBars: ScrollBars): string {
    switch (scrollBars) {
      case ScrollBars.Both:
      case ScrollBars.Vertical:
        return 'auto';
      default:
        return 'hidden';
    }
  }

  export function getCaptionAlignStyles(captionAlign: ContentAlignment, paddingLeft: number, paddingTop: number, paddingRight: number, paddingBottom: number): any {
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

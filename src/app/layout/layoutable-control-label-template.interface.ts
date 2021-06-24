import { TextAlign } from '@app/enums/text-align';

export interface ILayoutableControlLabelTemplate {

  getIsVisible: () => boolean;

  getForeColor: () => string;

  getBackColor: () => string;

  getFontFamily: () => string;

  getFontSize: () => number;

  getFontBold: () => boolean;

  getFontItalic: () => boolean;

  getFontUnderline: () => boolean;

  getTextAlign: () => TextAlign;

  getMarginLeft: () => number;

  getMarginRight: () => number;

  getMarginTop: () => number;

  getMarginBottom: () => number;

  getPaddingLeft: () => number;

  getPaddingRight: () => number;

  getPaddingTop: () => number;

  getPaddingBottom: () => number;

  getMinWidth: () => number;

  getMinHeight: () => number;

  getMaxWidth: () => number;

  getMaxHeight: () => number;
}

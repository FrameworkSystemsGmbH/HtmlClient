import { FsFont } from '../common/fs-font';
import { FsInsets } from '../common/fs-insets';

export interface ILayoutableControlLabelTemplate {

  getIsVisible(): boolean;

  setIsVisible(value: boolean): void;

  getBackColor(): string;

  setBackColor(value: string): void;

  getForeColor(): string;

  setForeColor(value: string): void;

  getFontFamily(): string;

  getFontSize(): number;

  getFontSizeUs(): number;

  getFontBold(): boolean;

  getFontItalic(): boolean;

  getFontUnderline(): boolean;

  getFont(): FsFont;

  getTextAlign(): string;

  getPaddingLeft(): number;

  getPaddingLeftUs(): number;

  getPaddingRight(): number;

  getPaddingRightUs(): number;

  getPaddingTop(): number;

  getPaddingTopUs(): number;

  getPaddingBottom(): number;

  getPaddingBottomUs(): number;

  hasPadding(): boolean;

  getPadding(): FsInsets;

  getMarginLeft(): number;

  getMarginLeftUs(): number;

  getMarginRight(): number;

  getMarginRightUs(): number;

  getMarginTop(): number;

  getMarginTopUs(): number;

  getMarginBottom(): number;

  getMarginBottomUs(): number;

  hasMargin(): boolean;

  getMargin(): FsInsets;

  getMinWidth(): number;

  getMinWidthUs(): number;

  getMinHeight(): number;

  getMinHeightUs(): number;

  getMaxWidth(): number;

  getMaxWidthUs(): number;

  getMaxHeight(): number;

  getMaxHeightUs(): number;
}

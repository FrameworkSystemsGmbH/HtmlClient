/// <reference path="../../../node_modules/@types/color/index.d.ts" />

import { FsFont, FsInsets } from '../models';

export interface LayoutableControlLabelTemplate {

  getIsVisible(): boolean;

  setIsVisible(value: boolean): void;

  getBackColor(): Color.Color;

  setBackColor(value: Color.Color): void;

  getForeColor(): Color.Color;

  setForeColor(value: Color.Color): void;

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

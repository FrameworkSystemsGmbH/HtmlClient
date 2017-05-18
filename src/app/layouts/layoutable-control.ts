import { ControlVisibility, HorizontalAlignment, VerticalAlignment } from '../enums/index';
import { LayoutableProperties } from './index';

export interface LayoutableControl {

  getName(): string;

  getVisibility(): ControlVisibility;

  getLayoutableProperties(): LayoutableProperties;

  getMinWidth(): number;

  getMinHeight(): number;

  getMaxWidth(): number;

  getMaxHeight(): number;

  getInsetsLeft(): number;

  getInsetsRight(): number;

  getInsetsTop(): number;

  getInsetsBottom(): number;

  getDockItemSize(): number;

  getFieldRowSize(): number;

  getAlignmentHorizontal(): HorizontalAlignment;

  getAlignmentVertical(): VerticalAlignment;

}

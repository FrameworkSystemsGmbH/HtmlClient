import { LayoutableProperties, LayoutableControlLabelTemplate, LayoutableControlLabel, LayoutableContainer } from '.';
import { ControlVisibility, HorizontalAlignment, VerticalAlignment } from '../enums';

export interface LayoutableControl {

  getMinLayoutWidth(): number;

  getMinLayoutHeight(width: number): number;

  getMaxLayoutWidth(): number;

  getMaxLayoutHeight(): number;

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

  getMarginLeft(): number;

  getMarginRight(): number;

  getMarginTop(): number;

  getMarginBottom(): number;

  getDockItemSize(): number;

  getFieldRowSize(): number;

  getHorizontalAlignment(): HorizontalAlignment;

  getVerticalAlignment(): VerticalAlignment;

  getControlLabel(): LayoutableControlLabel;

  getLabelTemplate(): LayoutableControlLabelTemplate;

  setParent(container: LayoutableContainer): void;

}

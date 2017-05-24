import { LayoutableProperties, LayoutableControlLabelTemplate, LayoutableControlLabel, LayoutableContainer } from '.';
import { ControlVisibility, HorizontalAlignment, VerticalAlignment } from '../enums';

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

  getMarginLeft(): number;

  getMarginRight(): number;

  getMarginTop(): number;

  getMarginBottom(): number;

  getDockItemSize(): number;

  getFieldRowSize(): number;

  getAlignmentHorizontal(): HorizontalAlignment;

  getAlignmentVertical(): VerticalAlignment;

  getControlLabel(): LayoutableControlLabel;

  getLabelTemplate(): LayoutableControlLabelTemplate;

  setParent(container: LayoutableContainer): void;

}

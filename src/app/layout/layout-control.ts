import { LayoutProperties, LayoutControlLabelTemplate, LayoutControlLabel, LayoutContainer } from '.';
import { ControlVisibility, HorizontalAlignment, VerticalAlignment } from '../enums';

export interface LayoutControl {

  getName(): string;

  getVisibility(): ControlVisibility;

  getLayoutProperties(): LayoutProperties;

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

  getControlLabel(): LayoutControlLabel;

  getLabelTemplate(): LayoutControlLabelTemplate;

  setParent(container: LayoutContainer): void;

}

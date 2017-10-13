import { LayoutableProperties } from './layoutable-properties';
import { LayoutableControlLabel } from './layoutable-control-label';
import { LayoutableControlLabelTemplate } from './layoutable-control-label-template';
import { LayoutableContainer } from './layoutable-container';
import { ControlVisibility } from '../enums/control-visibility';
import { HorizontalAlignment } from '../enums/horizontal-alignment';
import { VerticalAlignment } from '../enums/vertical-alignment';

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

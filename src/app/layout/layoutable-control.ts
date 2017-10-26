import { ILayoutableProperties } from './layoutable-properties';
import { ILayoutableControlLabel } from './layoutable-control-label';
import { ILayoutableControlLabelTemplate } from './layoutable-control-label-template';
import { ILayoutableContainer } from './layoutable-container';
import { ControlVisibility } from '../enums/control-visibility';
import { HorizontalAlignment } from '../enums/horizontal-alignment';
import { VerticalAlignment } from '../enums/vertical-alignment';

export interface ILayoutableControl {

  getMinLayoutWidth(): number;

  getMinLayoutHeight(width: number): number;

  getMaxLayoutWidth(): number;

  getMaxLayoutHeight(): number;

  getName(): string;

  getVisibility(): ControlVisibility;

  getLayoutableProperties(): ILayoutableProperties;

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

  getControlLabel(): ILayoutableControlLabel;

  getLabelTemplate(): ILayoutableControlLabelTemplate;

  setParent(container: ILayoutableContainer): void;

}

import { ILayoutableProperties } from 'app/layout/layoutable-properties.interface';

import { ControlVisibility } from 'app/enums/control-visibility';
import { HorizontalAlignment } from 'app/enums/horizontal-alignment';
import { VerticalAlignment } from 'app/enums/vertical-alignment';

export interface ILayoutableControl {

  getName(): string;

  getVisibility(): ControlVisibility;

  getLayoutableProperties(): ILayoutableProperties;

  getMinLayoutWidth(): number;

  getMinLayoutHeight(width: number): number;

  getMaxLayoutWidth(): number;

  getMaxLayoutHeight(): number;

  getMinWidth(): number;

  getMinHeight(): number;

  getMaxWidth(): number;

  getMaxHeight(): number;

  getMarginLeft(): number;

  getMarginRight(): number;

  getMarginTop(): number;

  getMarginBottom(): number;

  getInsetsLeft(): number;

  getInsetsRight(): number;

  getInsetsTop(): number;

  getInsetsBottom(): number;

  getDockItemSize(): number;

  getHorizontalAlignment(): HorizontalAlignment;

  getVerticalAlignment(): VerticalAlignment;
}

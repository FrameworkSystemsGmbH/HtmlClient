import { ILayoutableControl } from 'app/layout/layoutable-control.interface';

import { LayoutBase } from 'app/layout/layout-base';

export class ControlLayout extends LayoutBase {

  public measureMinWidth(): number {
    const control: ILayoutableControl = this.getControl();
    const minWidth = control.getMinWidth();

    return minWidth ? control.getMarginLeft() + minWidth + control.getMarginRight() : 0;
  }

  public measureMinHeight(width: number): number {
    const control: ILayoutableControl = this.getControl();
    const minHeight = control.getMinHeight();

    return minHeight ? control.getMarginTop() + minHeight + control.getMarginBottom() : 0;
  }
}

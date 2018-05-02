import { ILayoutableControl } from 'app/layout/layoutable-control.interface';

import { LayoutBase } from 'app/layout/layout-base';
import { Visibility } from 'app/enums/visibility';

export class ControlLayout extends LayoutBase {

  public measureMinWidth(): number {
    const control: ILayoutableControl = this.getControl();

    if (control.getVisibility() === Visibility.Collapsed) {
      return 0;
    }

    const minWidth = control.getMinWidth();

    return minWidth ? control.getMarginLeft() + minWidth + control.getMarginRight() : 0;
  }

  public measureMinHeight(width: number): number {
    const control: ILayoutableControl = this.getControl();

    if (control.getVisibility() === Visibility.Collapsed) {
      return 0;
    }

    const minHeight = control.getMinHeight();

    return minHeight ? control.getMarginTop() + minHeight + control.getMarginBottom() : 0;
  }
}

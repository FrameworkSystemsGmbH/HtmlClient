import { ILayoutableControl } from 'app/layout/layoutable-control.interface';

import { LayoutBase } from 'app/layout/layout-base';
import { Visibility } from 'app/enums/visibility';

export class ControlLayout extends LayoutBase {

  public measureMinWidth(): number {
    const control: ILayoutableControl = this.getControl();

    if (control.getCurrentVisibility() === Visibility.Collapsed) {
      return 0;
    }

    let minWidth = control.getMinWidth();

    if (minWidth > 0) {
      minWidth += control.getMarginLeft() + control.getMarginRight();
    }

    return minWidth;
  }

  public measureMinHeight(width: number): number {
    const control: ILayoutableControl = this.getControl();

    if (control.getCurrentVisibility() === Visibility.Collapsed) {
      return 0;
    }

    let minHeight = control.getMinHeight();

    if (minHeight > 0) {
      minHeight += control.getMarginTop() + control.getMarginBottom();
    }

    return minHeight;
  }
}

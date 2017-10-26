import { LayoutBase } from '../layout-base';
import { ILayoutableControl } from '../layoutable-control';

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

import { LayoutBase, LayoutableControl } from '..';

export class ControlLayout extends LayoutBase {

  public measureMinWidth(): number {
    let control: LayoutableControl = this.getControl();
    let minWidth = control.getMinWidth();

    return minWidth ? control.getMarginLeft() + minWidth + control.getMarginRight() : 0;
  }

  public measureMinHeight(width: number): number {
    let control: LayoutableControl = this.getControl();
    let minHeight = control.getMinHeight();

    return minHeight ? control.getMarginTop() + minHeight + control.getMarginBottom() : 0;
  }

}

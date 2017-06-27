import { LayoutBase, LayoutableControl } from '..';

export class ControlLayout extends LayoutBase {

  public measureMinWidth(): number {
    let control: LayoutableControl = this.getControl();
    return Number.zeroIfNull(control.getMinWidth()) + Number.zeroIfNull(control.getMarginLeft()) + Number.zeroIfNull(control.getMarginRight());
  }

  public measureMinHeight(width: number): number {
    let control: LayoutableControl = this.getControl();
    return Number.zeroIfNull(control.getMinHeight()) + Number.zeroIfNull(control.getMarginTop()) + Number.zeroIfNull(control.getMarginBottom());
  }

}

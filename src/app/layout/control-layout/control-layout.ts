import { LayoutBase, LayoutableControl } from '..';

export class ControlLayout extends LayoutBase {

  public measureMinWidth(): number {
    let control: LayoutableControl = this.getControl();
    return Number.zeroIfNull(control.getMinWidth()) + Number.zeroIfNull(control.getInsetsLeft()) + Number.zeroIfNull(control.getInsetsRight());
  }

  public measureMinHeight(width: number): number {
    let control: LayoutableControl = this.getControl();
    return Number.zeroIfNull(control.getMinHeight()) + Number.zeroIfNull(control.getInsetsTop()) + Number.zeroIfNull(control.getInsetsBottom());
  }

}

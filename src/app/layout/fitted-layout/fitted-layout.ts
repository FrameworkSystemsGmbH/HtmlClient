import { LayoutableControl, LayoutableControlFitted } from '..';
import { ControlLayout } from '../control-layout';

export class FittedLayout extends ControlLayout {

  constructor(container: LayoutableControlFitted) {
    super(container);
  }

  public getControl(): LayoutableControlFitted {
    return super.getControl() as LayoutableControlFitted;
  }

  public measureMinWidth(): number {
    let control: LayoutableControlFitted = this.getControl();
    if (control.hasFittedWidth()) {
      return Number.zeroIfNull(control.getFittedWidth()) + Number.zeroIfNull(control.getMarginLeft()) + Number.zeroIfNull(control.getMarginRight());
    } else {
      return Number.zeroIfNull(control.getMinWidth()) + Number.zeroIfNull(control.getMarginLeft()) + Number.zeroIfNull(control.getMarginRight());
    }
  }

  public measureMinHeight(width: number): number {
    let control: LayoutableControlFitted = this.getControl();
    if (control.hasFittedHeight()) {
      return Number.zeroIfNull(control.getFittedHeight()) + Number.zeroIfNull(control.getMarginTop()) + Number.zeroIfNull(control.getMarginBottom());
    } else {
      return Number.zeroIfNull(control.getMinHeight()) + Number.zeroIfNull(control.getMarginTop()) + Number.zeroIfNull(control.getMarginBottom());
    }
  }

}

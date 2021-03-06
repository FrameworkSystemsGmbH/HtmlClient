import { ILayoutableControl } from '@app/layout/layoutable-control.interface';

export abstract class LayoutBase {

  private readonly _control: ILayoutableControl;

  public constructor(control: ILayoutableControl) {
    this._control = control;
  }

  public getControl(): ILayoutableControl {
    return this._control;
  }

  public measureMaxWidth(): number {
    const control: ILayoutableControl = this.getControl();
    const maxWidth = control.getMaxWidth();

    return maxWidth === Number.MAX_SAFE_INTEGER ? maxWidth : control.getMarginLeft() + maxWidth + control.getMarginRight();
  }

  public measureMaxHeight(): number {
    const control: ILayoutableControl = this.getControl();
    const maxHeight = control.getMaxHeight();

    return maxHeight === Number.MAX_SAFE_INTEGER ? maxHeight : control.getMarginTop() + maxHeight + control.getMarginBottom();
  }

  public abstract measureMinWidth(): number;

  public abstract measureMinHeight(width: number): number;
}

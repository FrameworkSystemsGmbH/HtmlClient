import { ILayoutableProperties } from '@app/layout/layoutable-properties.interface';
import { ILayoutableControlWrapper } from '@app/wrappers/layout/layoutable-control-wrapper.interface';

export class LayoutableProperties implements ILayoutableProperties {

  private readonly _wrapper: ILayoutableControlWrapper;

  private _x: number;
  private _y: number;

  private _hBarNeeded: boolean;

  private _layoutWidth: number;
  private _layoutHeight: number;

  public constructor(wrapper: ILayoutableControlWrapper) {
    this._wrapper = wrapper;
  }

  public getX(): number {
    return this._x;
  }

  public setX(x: number): void {
    this._x = x;
  }

  public getY(): number {
    return this._y;
  }

  public setY(y: number): void {
    this._y = y;
  }

  public getHBarNeeded(): boolean {
    return this._hBarNeeded;
  }

  public setHBarNeeded(value: boolean): void {
    this._hBarNeeded = value;
  }

  public getLayoutWidth(): number {
    return this._layoutWidth;
  }

  public setLayoutWidth(layoutWidth: number): void {
    this._layoutWidth = layoutWidth;
  }

  public getLayoutHeight(): number {
    return this._layoutHeight;
  }

  public setLayoutHeight(layoutHeight: number): void {
    this._layoutHeight = layoutHeight;
  }

  /*
   * This width is used in the CSS of the HTML control.
   * Due to HTML box-sizing this value does not include horizontal margins
   */
  public getClientWidth(): number {
    return this._layoutWidth - this._wrapper.getMarginLeft() - this._wrapper.getMarginRight();
  }

  /*
   * This height is used in the CSS of the HTML control.
   * Due to HTML box-sizing this value does not include vertical margins
   */
  public getClientHeight(): number {
    return this._layoutHeight - this._wrapper.getMarginTop() - this._wrapper.getMarginBottom();
  }
}

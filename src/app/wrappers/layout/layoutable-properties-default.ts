import { ILayoutableProperties } from '@app/layout/layoutable-properties.interface';
import { ILayoutableControlWrapper } from '@app/wrappers/layout/layoutable-control-wrapper.interface';

export class LayoutableProperties implements ILayoutableProperties {

  private readonly wrapper: ILayoutableControlWrapper;

  private x: number;
  private y: number;

  private hBarNeeded: boolean;

  private layoutWidth: number;
  private layoutHeight: number;

  public constructor(wrapper: ILayoutableControlWrapper) {
    this.wrapper = wrapper;
  }

  public getX(): number {
    return this.x;
  }

  public setX(x: number): void {
    this.x = x;
  }

  public getY(): number {
    return this.y;
  }

  public setY(y: number): void {
    this.y = y;
  }

  public getHBarNeeded(): boolean {
    return this.hBarNeeded;
  }

  public setHBarNeeded(value: boolean): void {
    this.hBarNeeded = value;
  }

  public getLayoutWidth(): number {
    return this.layoutWidth;
  }

  public setLayoutWidth(layoutWidth: number): void {
    this.layoutWidth = layoutWidth;
  }

  public getLayoutHeight(): number {
    return this.layoutHeight;
  }

  public setLayoutHeight(layoutHeight: number): void {
    this.layoutHeight = layoutHeight;
  }

  /*
   * This width is used in the CSS of the HTML control.
   * Due to HTML box-sizing this value does not include horizontal margins
   */
  public getClientWidth(): number {
    return this.layoutWidth - this.wrapper.getMarginLeft() - this.wrapper.getMarginRight();
  }

  /*
   * This height is used in the CSS of the HTML control.
   * Due to HTML box-sizing this value does not include vertical margins
   */
  public getClientHeight(): number {
    return this.layoutHeight - this.wrapper.getMarginTop() - this.wrapper.getMarginBottom();
  }
}

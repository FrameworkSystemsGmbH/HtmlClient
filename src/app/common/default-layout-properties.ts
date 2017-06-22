import { LayoutableProperties } from '../layout';
import { BaseWrapper } from '../wrappers';

export class DefaultLayoutProperties implements LayoutableProperties {

  private width: number;
  private height: number;

  private x: number;
  private y: number;

  constructor(private wrapper: BaseWrapper) {}

  public getWidth(): number {
    return this.width;
  }

  public setWidth(width: number): void {
    this.width = Math.max(0, width - Number.zeroIfNull(this.wrapper.getMarginLeft()) - Number.zeroIfNull(this.wrapper.getMarginRight()));
  }

  public getHeight(): number {
    return this.height;
  }

  public setHeight(height: number): void {
    this.height = Math.max(0, height - Number.zeroIfNull(this.wrapper.getMarginTop()) - Number.zeroIfNull(this.wrapper.getMarginBottom()));
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

}

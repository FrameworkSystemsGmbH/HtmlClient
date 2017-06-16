import { LayoutProperties } from '../layout';
import { BaseWrapper } from '../wrappers';

export class DefaultLayoutProperties implements LayoutProperties {

  private width: number;
  private height: number;

  private x: number;
  private y: number;

  constructor(private wrapper: BaseWrapper) { }

  public getWidth(): number {
    return this.width;
  }

  public setWidth(width: number): void {
    this.width = width;
  }

  public getHeight(): number {
    return this.height;
  }

  public setHeight(height: number): void {
    this.height = height;
  }

  public getMinLayoutWidth(): number {
    return 0;
  }

  public getMinLayoutHeight(width: number): number {
    return 0;
  }

  public getMaxLayoutWidth(): number {
    return 0;
  }

  public getMaxLayoutHeight(): number {
    return 0;
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

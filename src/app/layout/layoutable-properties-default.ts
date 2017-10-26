import { ILayoutableProperties } from './layoutable-properties';
import { BaseWrapper } from '../wrappers/base-wrapper';

export class LayoutablePropertiesDefault implements ILayoutableProperties {

  private layoutWidth: number;
  private layoutHeight: number;

  private x: number;
  private y: number;

  private hBarNeeded: boolean;
  private vBarNeeded: boolean;

  constructor(private wrapper: BaseWrapper) { }

  // This is the width that gets used in the CSS for the HTML control.
  // Horizontal margins must be subtracted from the layout width due to HTML box-sizing.
  public getWidth(): number {
    return this.layoutWidth - this.wrapper.getMarginLeft() - this.wrapper.getMarginRight();
  }

  // This width includes margins and should only be used by layouts
  // Never use this value directly in HTML or CSS
  public getLayoutWidth(): number {
    return this.layoutWidth;
  }

  public setLayoutWidth(layoutWidth: number): void {
    this.layoutWidth = layoutWidth;
  }

  // This is the height that gets used in the CSS for the HTML control.
  // Vertical margins must be subtracted from the layout height due to HTML box-sizing.
  public getHeight(): number {
    return this.layoutHeight - this.wrapper.getMarginTop() - this.wrapper.getMarginBottom();
  }

  // This height includes margins and should only be used by layouts
  // Never use this value directly in HTML or CSS
  public getLayoutHeight(): number {
    return this.layoutHeight;
  }

  public setLayoutHeight(layoutHeight: number): void {
    this.layoutHeight = layoutHeight;
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

  public setHBarNeeded(needed: boolean): void {
    this.hBarNeeded = needed;
  }

  public getVBarNeeded(): boolean {
    return this.vBarNeeded;
  }

  public setVBarNeeded(needed: boolean): void {
    this.vBarNeeded = needed;
  }

}

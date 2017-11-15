import { ILayoutableWrapper } from 'app/wrappers/layout/layoutable-wrapper.interface';
import { ILayoutableProperties } from 'app/layout/layoutable-properties.interface';

export class LayoutablePropertiesDefault implements ILayoutableProperties {

  private wrapper: ILayoutableWrapper;

  private layoutWidth: number;
  private layoutHeight: number;

  private x: number;
  private y: number;

  constructor(wrapper: ILayoutableWrapper) {
    this.wrapper = wrapper;
  }

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
}

export interface LayoutableProperties {

  // This is the width that gets used in the CSS for the HTML control.
  // Horizontal margins must be subtracted from the layout width due to HTML box-sizing.
  getWidth(): number;

  // This width includes margins and should only be used by layouts
  // Never use this value directly in HTML or CSS
  getLayoutWidth(): number;

  setLayoutWidth(width: number): void;

  // This is the height that gets used in the CSS for the HTML control.
  // Vertical margins must be subtracted from the layout height due to HTML box-sizing.
  getHeight(): number;

  // This height includes margins and should only be used by layouts
  // Never use this value directly in HTML or CSS
  getLayoutHeight(): number;

  setLayoutHeight(height: number): void;

  getX(): number;

  setX(x: number): void;

  getY(): number;

  setY(y: number): void;

}

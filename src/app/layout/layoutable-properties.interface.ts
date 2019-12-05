export interface ILayoutableProperties {

  getX(): number;

  setX(x: number): void;

  getY(): number;

  setY(y: number): void;

  getHBarNeeded(): boolean;

  setHBarNeeded(value: boolean): void;

  getLayoutWidth(): number;

  setLayoutWidth(width: number): void;

  getLayoutHeight(): number;

  setLayoutHeight(height: number): void;

  // This width is used in the CSS of the HTML control.
  // Due to HTML box-sizing this value does not include horizontal margins
  getClientWidth(): number;

  // This height is used in the CSS of the HTML control.
  // Due to HTML box-sizing this value does not include vertical margins
  getClientHeight(): number;
}

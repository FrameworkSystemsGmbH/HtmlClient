export interface LayoutableProperties {

  getWidth(): number;

  getLayoutWidth(): number;

  setLayoutWidth(width: number): void;

  getHeight(): number;

  getLayoutHeight(): number;

  setLayoutHeight(height: number): void;

  getX(): number;

  setX(x: number): void;

  getY(): number;

  setY(y: number): void;

}

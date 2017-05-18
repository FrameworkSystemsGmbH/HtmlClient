import { LayoutableControl } from './index';

export interface LayoutableProperties {

  getWidth(): number;

  setWidth(width: number): void;

  getHeight(): number;

  setHeight(height: number): void;

  getMinLayoutWidth(): number;

  getMinLayoutHeight(width: number): number;

  getMaxLayoutWidth(): number;

  getMaxLayoutHeight(): number;

  getX(): number;

  setX(x: number): void;

  getY(): number;

  setY(y: number): void;

}

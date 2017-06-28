import { LayoutableControl } from '.';

export interface LayoutableControlFitted extends LayoutableControl {

  isMinWidthSet(): boolean;

  isMinHeightSet(): boolean;

  getFittedWidth(): number;

  getFittedHeight(): number;

}

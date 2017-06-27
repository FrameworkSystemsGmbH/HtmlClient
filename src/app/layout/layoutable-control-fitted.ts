import { LayoutableControl } from '.';

export interface LayoutableControlFitted extends LayoutableControl {

  hasFittedWidth(): boolean;

  getFittedWidth(): number;

  hasFittedHeight(): boolean;

  getFittedHeight(): number;

}

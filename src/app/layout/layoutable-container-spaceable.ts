import { LayoutableContainer } from './layoutable-container';

export interface LayoutableContainerSpaceable extends LayoutableContainer {

  getSpacingHorizontal(): number;

  getSpacingVertical(): number;

}

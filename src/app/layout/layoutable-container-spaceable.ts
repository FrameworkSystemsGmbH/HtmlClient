import { LayoutableContainer } from '.';

export interface LayoutableContainerSpaceable extends LayoutableContainer {

  getSpacingHorizontal(): number;

  getSpacingVertical(): number;

}

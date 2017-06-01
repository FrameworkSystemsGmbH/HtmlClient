import { LayoutContainer } from '.';

export interface LayoutContainerSpaceable extends LayoutContainer {

  getSpacingHorizontal(): number;

  getSpacingVertical(): number;

}

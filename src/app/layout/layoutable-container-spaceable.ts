import { ILayoutableContainer } from './layoutable-container';

export interface ILayoutableContainerSpaceable extends ILayoutableContainer {

  getSpacingHorizontal(): number;

  getSpacingVertical(): number;

}

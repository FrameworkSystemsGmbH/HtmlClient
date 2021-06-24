import { ILayoutableContainer } from '@app/layout/layoutable-container.interface';

export interface ILayoutableContainerSpaceable extends ILayoutableContainer {

  getSpacingHorizontal: () => number;

  getSpacingVertical: () => number;

}

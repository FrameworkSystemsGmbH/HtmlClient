import { DockOrientation } from '.';
import { LayoutableContainer } from '..';

export interface DockContainer extends LayoutableContainer {

  getSpacingHorizontal(): number;

  getSpacingVertical(): number;

  getDockOrientation(): DockOrientation;

}

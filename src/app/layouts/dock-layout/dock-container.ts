import { LayoutableContainer } from '../index';
import { DockOrientation } from './index';

export interface DockContainer extends LayoutableContainer {

  getSpacingHorizontal(): number;

  getSpacingVertical(): number;

  getDockOrientation(): DockOrientation;

}

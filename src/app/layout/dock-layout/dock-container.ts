import { DockOrientation } from '.';
import { LayoutableContainerSpaceable } from '..';

export interface DockContainer extends LayoutableContainerSpaceable {

  getDockOrientation(): DockOrientation;

}

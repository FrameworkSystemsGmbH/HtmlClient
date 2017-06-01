import { DockOrientation } from '.';
import { LayoutContainerSpaceable } from '..';

export interface DockContainer extends LayoutContainerSpaceable {

  getDockOrientation(): DockOrientation;

}

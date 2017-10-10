import { DockOrientation } from './dock-orientation';
import { LayoutableContainerSpaceable } from '../layoutable-container-spaceable';

export interface DockContainer extends LayoutableContainerSpaceable {

  getDockOrientation(): DockOrientation;

}

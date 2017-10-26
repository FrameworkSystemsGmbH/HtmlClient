import { DockOrientation } from './dock-orientation';
import { ILayoutableContainerSpaceable } from '../layoutable-container-spaceable';

export interface IDockContainer extends ILayoutableContainerSpaceable {

  getDockOrientation(): DockOrientation;

}

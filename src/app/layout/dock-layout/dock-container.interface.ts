import { ILayoutableContainerSpaceable } from 'app/layout/layoutable-container-spaceable.interface';

import { DockOrientation } from 'app/layout/dock-layout/dock-orientation';

export interface IDockContainer extends ILayoutableContainerSpaceable {

  getDockOrientation(): DockOrientation;

}

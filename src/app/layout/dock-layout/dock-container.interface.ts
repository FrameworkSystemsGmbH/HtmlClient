import { ILayoutableContainerSpaceable } from 'app/layout/layoutable-container-spaceable.interface';

import { DockOrientation } from 'app/layout/dock-layout/dock-orientation';
import { DockPanelScrolling } from 'app/enums/dockpanel-scrolling';

export interface IDockContainer extends ILayoutableContainerSpaceable {

  getDockOrientation(): DockOrientation;

  getDockPanelScrolling(): DockPanelScrolling;

}

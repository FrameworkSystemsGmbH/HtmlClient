import { DockPanelScrolling } from '@app/enums/dockpanel-scrolling';
import { DockOrientation } from '@app/layout/dock-layout/dock-orientation';
import { ILayoutableContainerSpaceable } from '@app/layout/layoutable-container-spaceable.interface';

export interface IDockContainer extends ILayoutableContainerSpaceable {

  getDockOrientation: () => DockOrientation;

  getDockPanelScrolling: () => DockPanelScrolling;

}

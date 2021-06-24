import { TabAlignment } from '@app/enums/tab-alignment';
import { ILayoutableContainer } from '@app/layout/layoutable-container.interface';

export interface ITabbedLayoutControl extends ILayoutableContainer {

  getIsMobileMode: () => boolean;

  getTabAlignment: () => TabAlignment;

  getSelectedTabIndex: () => number;

  getWidestLayoutTabPageHeader: () => number;

  getHighestLayoutTabPageHeader: () => number;

  getBorderThicknessLeft: () => number;

  getBorderThicknessRight: () => number;

  getBorderThicknessTop: () => number;

  getBorderThicknessBottom: () => number;
}

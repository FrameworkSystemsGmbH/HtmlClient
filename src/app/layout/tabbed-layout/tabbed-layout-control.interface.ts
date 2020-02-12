import { ILayoutableContainer } from 'app/layout/layoutable-container.interface';

import { TabAlignment } from 'app/enums/tab-alignment';

export interface ITabbedLayoutControl extends ILayoutableContainer {

  getIsMobileMode(): boolean;

  getTabAlignment(): TabAlignment;

  getSelectedTabIndex(): number;

  getWidestTabPageHeader(): number;

  getHighestTabPageHeader(): number;

  getBorderThicknessLeft(): number;

  getBorderThicknessRight(): number;

  getBorderThicknessTop(): number;

  getBorderThicknessBottom(): number;
}
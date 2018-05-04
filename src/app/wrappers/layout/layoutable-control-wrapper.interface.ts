import { ILayoutableControl } from 'app/layout/layoutable-control.interface';
import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';

import { VchControl } from 'app/vch/vch-control';

export interface ILayoutableControlWrapper extends ILayoutableControl {

  getVchControl(): VchControl;

  attachComponent(uiContainer: ILayoutableContainerWrapper, vchContainer: ILayoutableContainerWrapper): void;

}

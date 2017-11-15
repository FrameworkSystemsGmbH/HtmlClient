import { ILayoutableControl } from 'app/layout/layoutable-control.interface';
import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';

import { VchControl } from 'app/vch/vch-control';

export interface ILayoutableWrapper extends ILayoutableControl {

  getVchControl(): VchControl;

  attachComponent(container: ILayoutableContainerWrapper): void;

}


import { ILayoutableControl } from 'app/layout/layoutable-control.interface';

import { LayoutContainerBase } from 'app/layout/layout-container-base';

export interface ILayoutableContainer extends ILayoutableControl {

  getLayout(): LayoutContainerBase;

  getLayoutableControls(): Array<ILayoutableControl>;

}

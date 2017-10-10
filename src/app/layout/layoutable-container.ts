import { LayoutableControl } from './layoutable-control';
import { LayoutContainerBase } from './layout-container-base';

export interface LayoutableContainer extends LayoutableControl {

  getLayoutableControls(): Array<LayoutableControl>;

  getLayout(): LayoutContainerBase;

  removeChild(child: LayoutableControl);

}

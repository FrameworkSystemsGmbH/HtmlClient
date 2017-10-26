import { ILayoutableControl } from './layoutable-control';
import { LayoutContainerBase } from './layout-container-base';

export interface ILayoutableContainer extends ILayoutableControl {

  getLayoutableControls(): Array<ILayoutableControl>;

  getLayout(): LayoutContainerBase;

  removeChild(child: ILayoutableControl);

}

import { LayoutContainerBase } from '@app/layout/layout-container-base';
import { ILayoutableControl } from '@app/layout/layoutable-control.interface';

export interface ILayoutableContainer extends ILayoutableControl {

  isILayoutableContainer(): void;

  getLayout(): LayoutContainerBase;

  getLayoutableControls(): Array<ILayoutableControl>;

}

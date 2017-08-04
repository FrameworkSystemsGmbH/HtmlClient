import { LayoutableControl, LayoutContainerBase } from '.';

export interface LayoutableContainer extends LayoutableControl {

  getLayoutableControls(): Array<LayoutableControl>;

  getLayout(): LayoutContainerBase;

  removeChild(child: LayoutableControl);

}

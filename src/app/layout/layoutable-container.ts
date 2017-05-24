import { LayoutableControl } from '.';

export interface LayoutableContainer extends LayoutableControl {

  getLayoutableControls(): Array<LayoutableControl>;

  removeChild(child: LayoutableControl);

}

import { LayoutControl } from '.';

export interface LayoutContainer extends LayoutControl {

  getLayoutControls(): Array<LayoutControl>;

  removeChild(child: LayoutControl);

}

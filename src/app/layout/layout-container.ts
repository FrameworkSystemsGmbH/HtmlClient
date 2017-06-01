import { LayoutControl } from '.';

export interface LayoutContainer extends LayoutControl {

  getLayoutableControls(): Array<LayoutControl>;

  removeChild(child: LayoutControl);

}

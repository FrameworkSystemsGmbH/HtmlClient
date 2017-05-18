import { LayoutableControl } from './index';

export interface LayoutableContainer extends LayoutableControl {

  getLayoutableControls(): Array<LayoutableControl>;

}

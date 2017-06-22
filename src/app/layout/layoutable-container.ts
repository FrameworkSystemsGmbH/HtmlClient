import { LayoutableControl } from '.';
import { HorizontalContentAlignment, VerticalContentAlignment } from '../enums';

export interface LayoutableContainer extends LayoutableControl {

  getLayoutableControls(): Array<LayoutableControl>;

  removeChild(child: LayoutableControl);

}

import { LayoutableControl, LayoutContainerBase } from '.';
import { HorizontalContentAlignment, VerticalContentAlignment } from '../enums';

export interface LayoutableContainer extends LayoutableControl {

  getLayoutableControls(): Array<LayoutableControl>;

  getLayout(): LayoutContainerBase;

  removeChild(child: LayoutableControl);

}

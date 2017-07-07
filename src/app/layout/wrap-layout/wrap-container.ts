import { LayoutableContainerSpaceable } from '..';
import { HorizontalContentAlignment, VerticalContentAlignment } from '../../enums';
import { WrapArrangement } from '.';

export interface WrapContainer extends LayoutableContainerSpaceable {

  getHorizontalContentAlignment(): HorizontalContentAlignment;

  getVerticalContentAlignment(): VerticalContentAlignment;

  getWrapArrangement(): WrapArrangement;

  getInvertFlowDirection(): boolean;

}

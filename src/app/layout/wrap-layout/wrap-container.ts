import { WrapArrangement } from '.';
import { LayoutableContainer } from '..';
import { HorizontalContentAlignment, VerticalContentAlignment } from '../../enums';
import { LayoutableContainerSpaceable } from '..';

export interface WrapContainer extends LayoutableContainerSpaceable {

  getContentAlignmentHorizontal(): HorizontalContentAlignment;

  getContentAlignmentVertical(): VerticalContentAlignment;

  getWrapArrangement(): WrapArrangement;

  getInvertFlowDirection(): boolean;

}

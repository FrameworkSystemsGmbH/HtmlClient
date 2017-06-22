import { LayoutableContainerSpaceable } from '..';
import { HorizontalContentAlignment, VerticalContentAlignment } from '../../enums';
import { WrapArrangement } from '.';

export interface WrapContainer extends LayoutableContainerSpaceable {

  getContentAlignmentHorizontal(): HorizontalContentAlignment;

  getContentAlignmentVertical(): VerticalContentAlignment;

  getWrapArrangement(): WrapArrangement;

  getInvertFlowDirection(): boolean;

}

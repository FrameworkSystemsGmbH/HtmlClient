import { WrapArrangement } from '.';
import { LayoutContainer } from '..';
import { HorizontalContentAlignment, VerticalContentAlignment } from '../../enums';
import { LayoutContainerSpaceable } from '..';

export interface WrapContainer extends LayoutContainerSpaceable {

  getContentAlignmentHorizontal(): HorizontalContentAlignment;

  getContentAlignmentVertical(): VerticalContentAlignment;

  getWrapArrangement(): WrapArrangement;

  getInvertFlowDirection(): boolean;

}

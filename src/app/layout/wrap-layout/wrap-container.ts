import { WrapArrangement } from '.';
import { LayoutableContainer } from '..';
import { HorizontalContentAlignment, VerticalContentAlignment } from '../../enums';

export interface WrapContainer extends LayoutableContainer {

  getContentAlignmentHorizontal(): HorizontalContentAlignment;

  getContentAlignmentVertical(): VerticalContentAlignment;

  getSpacingHorizontal(): number;

  getSpacingVertical(): number;

  getWrapArrangement(): WrapArrangement;

  getInvertFlowDirection(): boolean;

}

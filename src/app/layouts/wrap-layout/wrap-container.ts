import { LayoutableContainer } from '../index';
import { HorizontalContentAlignment, VerticalContentAlignment } from '../../enums/index';
import { WrapArrangement } from './index';

export interface WrapContainer extends LayoutableContainer {

  getContentAlignmentHorizontal(): HorizontalContentAlignment;

  getContentAlignmentVertical(): VerticalContentAlignment;

  getSpacingHorizontal(): number;

  getSpacingVertical(): number;

  getWrapArrangement(): WrapArrangement;

  getInvertFlowDirection(): boolean;

}

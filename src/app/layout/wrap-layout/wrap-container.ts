import { LayoutableContainerSpaceable } from '../layoutable-container-spaceable';
import { WrapArrangement } from './wrap-arrangement';
import { HorizontalContentAlignment, VerticalContentAlignment } from '../../enums';

export interface WrapContainer extends LayoutableContainerSpaceable {

  getHorizontalContentAlignment(): HorizontalContentAlignment;

  getVerticalContentAlignment(): VerticalContentAlignment;

  getWrapArrangement(): WrapArrangement;

  getInvertFlowDirection(): boolean;

}

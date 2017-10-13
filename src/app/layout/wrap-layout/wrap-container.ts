import { LayoutableContainerSpaceable } from '../layoutable-container-spaceable';
import { WrapArrangement } from './wrap-arrangement';
import { HorizontalContentAlignment } from '../../enums/horizontal-content-alignment';
import { VerticalContentAlignment } from '../../enums/vertical-content-alignment';

export interface WrapContainer extends LayoutableContainerSpaceable {

  getHorizontalContentAlignment(): HorizontalContentAlignment;

  getVerticalContentAlignment(): VerticalContentAlignment;

  getWrapArrangement(): WrapArrangement;

  getInvertFlowDirection(): boolean;

}

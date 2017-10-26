import { ILayoutableContainerSpaceable } from '../layoutable-container-spaceable';
import { WrapArrangement } from './wrap-arrangement';
import { HorizontalContentAlignment } from '../../enums/horizontal-content-alignment';
import { VerticalContentAlignment } from '../../enums/vertical-content-alignment';

export interface IWrapContainer extends ILayoutableContainerSpaceable {

  getHorizontalContentAlignment(): HorizontalContentAlignment;

  getVerticalContentAlignment(): VerticalContentAlignment;

  getWrapArrangement(): WrapArrangement;

  getInvertFlowDirection(): boolean;

}

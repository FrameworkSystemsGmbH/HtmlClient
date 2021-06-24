import { HorizontalContentAlignment } from '@app/enums/horizontal-content-alignment';
import { VerticalContentAlignment } from '@app/enums/vertical-content-alignment';
import { ILayoutableContainerSpaceable } from '@app/layout/layoutable-container-spaceable.interface';
import { WrapArrangement } from '@app/layout/wrap-layout/wrap-arrangement';

export interface IWrapContainer extends ILayoutableContainerSpaceable {

  getHorizontalContentAlignment: () => HorizontalContentAlignment;

  getVerticalContentAlignment: () => VerticalContentAlignment;

  getWrapArrangement: () => WrapArrangement;

  getInvertFlowDirection: () => boolean;

}

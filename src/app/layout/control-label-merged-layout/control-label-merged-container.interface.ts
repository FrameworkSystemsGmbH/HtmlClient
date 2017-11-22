import { ILayoutableContainer } from 'app/layout/layoutable-container.interface';

import { TextAlign } from 'app/enums/text-align';

export interface IControlLabelMergedContainer extends ILayoutableContainer {

  getTextAlign(): TextAlign;

}

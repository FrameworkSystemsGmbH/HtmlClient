import { ILayoutableContainer } from '@app/layout/layoutable-container.interface';

import { TextAlign } from '@app/enums/text-align';

export interface IControlLabelContainer extends ILayoutableContainer {

  getTextAlign(): TextAlign;

}

import { TextAlign } from '@app/enums/text-align';
import { ILayoutableContainer } from '@app/layout/layoutable-container.interface';

export interface IControlLabelContainer extends ILayoutableContainer {

  getTextAlign: () => TextAlign;

}

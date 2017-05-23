import { LayoutableContainer, LayoutableControlLabelTemplate } from '..';

export interface FieldContainer extends LayoutableContainer {

  getSynchronizeColumns(): boolean;

  getRowLabelTemplate(): LayoutableControlLabelTemplate;

}

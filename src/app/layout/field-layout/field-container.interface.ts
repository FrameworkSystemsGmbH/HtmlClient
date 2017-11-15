import { ILayoutableContainerSpaceable } from 'app/layout/layoutable-container-spaceable.interface';
import { ILayoutableControlLabelTemplate } from 'app/layout/layoutable-control-label-template.interface';

export interface IFieldContainer extends ILayoutableContainerSpaceable {

  getSynchronizeColumns(): boolean;

  getRowLabelTemplate(): ILayoutableControlLabelTemplate;

}

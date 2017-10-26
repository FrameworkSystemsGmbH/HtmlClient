import { ILayoutableContainerSpaceable } from '../layoutable-container-spaceable';
import { ILayoutableControlLabel } from '../layoutable-control-label';
import { ILayoutableControlLabelTemplate } from '../layoutable-control-label-template';

export interface IFieldContainer extends ILayoutableContainerSpaceable {

  getLayoutableControlLabels(): Array<ILayoutableControlLabel>;

  getSynchronizeColumns(): boolean;

  getRowLabelTemplate(): ILayoutableControlLabelTemplate;

}

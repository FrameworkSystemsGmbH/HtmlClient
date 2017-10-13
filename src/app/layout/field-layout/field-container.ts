import { LayoutableContainerSpaceable } from '../layoutable-container-spaceable';
import { LayoutableControlLabel } from '../layoutable-control-label';
import { LayoutableControlLabelTemplate } from '../layoutable-control-label-template';

export interface FieldContainer extends LayoutableContainerSpaceable {

  getLayoutableControlLabels(): Array<LayoutableControlLabel>;

  getSynchronizeColumns(): boolean;

  getRowLabelTemplate(): LayoutableControlLabelTemplate;

}

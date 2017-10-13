import { LayoutableContainerSpaceable } from '..';
import { LayoutableControlLabel } from '..';
import { LayoutableControlLabelTemplate } from '..';

export interface FieldContainer extends LayoutableContainerSpaceable {

  getLayoutableControlLabels(): Array<LayoutableControlLabel>;

  getSynchronizeColumns(): boolean;

  getRowLabelTemplate(): LayoutableControlLabelTemplate;

}

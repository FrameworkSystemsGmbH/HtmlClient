import { LayoutableContainerSpaceable } from '..';
import { LayoutableControlLabel } from '..';
import { LayoutableControlLabelTemplate } from '..';
import { FieldRowControl } from './field-row-control';

export interface FieldContainer extends LayoutableContainerSpaceable {

  getLayoutableControls(): Array<FieldRowControl>;

  getLayoutableControlLabels(): Array<LayoutableControlLabel>;

  getSynchronizeColumns(): boolean;

  getRowLabelTemplate(): LayoutableControlLabelTemplate;

}

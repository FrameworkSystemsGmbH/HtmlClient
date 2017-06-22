import { LayoutableControlLabelTemplate, LayoutableControlLabel, LayoutableContainerSpaceable } from '..';
import { FieldRowControl } from '.';

export interface FieldContainer extends LayoutableContainerSpaceable {

  getLayoutableControls(): Array<FieldRowControl>;

  getLayoutableControlLabels(): Array<LayoutableControlLabel>;

  getSynchronizeColumns(): boolean;

  getRowLabelTemplate(): LayoutableControlLabelTemplate;

}

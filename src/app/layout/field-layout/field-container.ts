import { LayoutControlLabelTemplate, LayoutControlLabel, LayoutContainerSpaceable } from '..';
import { FieldRowControl } from '.';

export interface FieldContainer extends LayoutContainerSpaceable {

  getLayoutableControls(): Array<FieldRowControl>;

  getLayoutableControlLabels(): Array<LayoutControlLabel>;

  getSynchronizeColumns(): boolean;

  getRowLabelTemplate(): LayoutControlLabelTemplate;

}

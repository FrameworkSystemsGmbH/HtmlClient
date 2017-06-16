import { LayoutControlLabelTemplate, LayoutControlLabel, LayoutContainerSpaceable } from '..';
import { FieldRowControl } from '.';

export interface FieldContainer extends LayoutContainerSpaceable {

  getLayoutControls(): Array<FieldRowControl>;

  getLayoutControlLabels(): Array<LayoutControlLabel>;

  getSynchronizeColumns(): boolean;

  getRowLabelTemplate(): LayoutControlLabelTemplate;

}

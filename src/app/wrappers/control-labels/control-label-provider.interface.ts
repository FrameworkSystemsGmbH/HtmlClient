import { ControlLabelTemplate } from 'app/wrappers/control-labels/control-label-template';
import { ControlVisibility } from 'app/enums/control-visibility';

export interface IControlLabelProvider {

  getName(): string;

  getCaption(): string;

  getIsEditable(): boolean;

  getVisibility(): ControlVisibility;

  getLabelTemplate(): ControlLabelTemplate;

}

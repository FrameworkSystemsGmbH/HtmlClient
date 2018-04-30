import { ControlLabelTemplate } from 'app/wrappers/control-labels/control-label-template';
import { Visibility } from 'app/enums/visibility';

export interface IControlLabelProvider {

  getName(): string;

  getCaption(): string;

  getIsEditable(): boolean;

  getVisibility(): Visibility;

  getLabelTemplate(): ControlLabelTemplate;

}

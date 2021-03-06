import { Visibility } from '@app/enums/visibility';
import { ControlLabelTemplate } from '@app/wrappers/control-labels/control-label-template';

export interface IControlLabelProvider {

  getName: () => string;

  getCaption: () => string | null;

  getCurrentIsEditable: () => boolean;

  getCurrentVisibility: () => Visibility;

  getLabelTemplate: () => ControlLabelTemplate;

}

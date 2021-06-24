import { FieldRowWrapper } from '@app/wrappers/field-row-wrapper';
import { ILayoutableControlWrapper } from '@app/wrappers/layout/layoutable-control-wrapper.interface';

export interface IControlLabelWrapper extends ILayoutableControlWrapper {

  getFieldRowWrapper: () => FieldRowWrapper;

  updateComponentRecursively: () => void;

  onWrapperCaptionChanged: () => void;

  onWrapperVisibilityChanged: () => void;

}

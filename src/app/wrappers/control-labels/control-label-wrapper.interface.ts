import { ILayoutableControlWrapper } from '@app/wrappers/layout/layoutable-control-wrapper.interface';

export interface IControlLabelWrapper extends ILayoutableControlWrapper {

  updateComponentRecursively(): void;

  onWrapperVisibilityChanged(): void;

}

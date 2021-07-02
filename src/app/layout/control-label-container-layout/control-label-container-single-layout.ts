import { ControlLabelContainerBaseLayout } from '@app/layout/control-label-container-layout/control-label-container-base-layout';
import { LayoutableControlWrapper } from '@app/layout/layoutable-control-wrapper';

export class ControlLabelContainerSingleLayout extends ControlLabelContainerBaseLayout {

  protected checkWrapperVisibility(wrapper: LayoutableControlWrapper): boolean {
    return wrapper.getIsLayoutVisible();
  }
}

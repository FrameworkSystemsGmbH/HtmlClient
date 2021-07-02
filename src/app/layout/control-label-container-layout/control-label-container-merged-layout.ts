import { Visibility } from '@app/enums/visibility';
import { ControlLabelContainerBaseLayout } from '@app/layout/control-label-container-layout/control-label-container-base-layout';
import { LayoutableControlWrapper } from '@app/layout/layoutable-control-wrapper';

export class ControlLabelContainerMergedLayout extends ControlLabelContainerBaseLayout {

  protected checkWrapperVisibility(wrapper: LayoutableControlWrapper): boolean {
    return wrapper.getVisibility() === Visibility.Visible;
  }
}

import { ControlLabelContainerBaseLayout } from '@app/layout/control-label-container-layout/control-label-container-base-layout';
import { LayoutableControlWrapper } from '@app/layout/layoutable-control-wrapper';
import { Visibility } from '@app/enums/visibility';

export class ControlLabelContainerMergedLayout extends ControlLabelContainerBaseLayout {

  protected checkWrapperVisibility(wrapper: LayoutableControlWrapper): boolean {
    return wrapper ? wrapper.getVisibility() === Visibility.Visible : false;
  }
}

import { ControlLabelWrapper } from 'app/wrappers/control-labels/control-label-wrapper';
import { Visibility } from 'app/enums/visibility';

export class ControlLabelSeparatorWrapper extends ControlLabelWrapper {

  public getCurrentIsEditable(): boolean {
    return this.getLabelProvider().getCurrentIsEditable();
  }

  public getCurrentVisibility(): Visibility {
    return this.getLabelProvider().getCurrentVisibility();
  }
}

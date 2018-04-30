import { ControlLabelWrapper } from 'app/wrappers/control-labels/control-label-wrapper';
import { Visibility } from 'app/enums/visibility';

export class ControlLabelSeparatorWrapper extends ControlLabelWrapper {

  public isMinWidthSet(): boolean {
    return false;
  }

  public isMinheightSet(): boolean {
    return false;
  }

  public getIsEditable(): boolean {
    return this.getLabelProvider().getIsEditable();
  }

  public getVisibility(): Visibility {
    return this.getLabelProvider().getVisibility();
  }
}

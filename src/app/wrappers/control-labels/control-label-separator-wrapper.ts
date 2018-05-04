import { ControlLabelWrapper } from 'app/wrappers/control-labels/control-label-wrapper';
import { Visibility } from 'app/enums/visibility';

export class ControlLabelSeparatorWrapper extends ControlLabelWrapper {

  private visibility: Visibility;

  public getCurrentIsEditable(): boolean {
    return this.getLabelProvider().getCurrentIsEditable();
  }

  public getCurrentVisibility(): Visibility {
    return this.visibility != null ? this.visibility : this.getLabelProvider().getCurrentVisibility();
  }

  public setVisibility(visibility: Visibility): void {
    this.visibility = visibility;
  }
}

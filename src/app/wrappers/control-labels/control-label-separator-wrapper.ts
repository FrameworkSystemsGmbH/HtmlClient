import { Visibility } from '@app/enums/visibility';
import { ControlLabelWrapper } from '@app/wrappers/control-labels/control-label-wrapper';

export class ControlLabelSeparatorWrapper extends ControlLabelWrapper {

  private _visibility: Visibility | null = null;

  public getCurrentIsEditable(): boolean {
    return this.getLabelProvider().getCurrentIsEditable();
  }

  public getCurrentVisibility(): Visibility {
    return this._visibility != null ? this._visibility : this.getLabelProvider().getCurrentVisibility();
  }

  public setVisibility(visibility: Visibility): void {
    this._visibility = visibility;
  }

  public getMinWidth(): number {
    return Number.zeroIfNull(this.fittedWidth);
  }

  public getMinHeight(): number {
    return Number.zeroIfNull(this.fittedHeight);
  }
}

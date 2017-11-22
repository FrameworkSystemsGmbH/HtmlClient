import { IControlLabelProvider } from 'app/wrappers/control-labels/control-label-provider.interface';

import { ControlLabelTemplate } from 'app/wrappers/control-labels/control-label-template';
import { ControlVisibility } from 'app/enums/control-visibility';

export class ControlLabelSeparatorProvider implements IControlLabelProvider {

  private rowLabelTemplate: ControlLabelTemplate;

  constructor(rowLabelTemplate: ControlLabelTemplate) {
    this.rowLabelTemplate = rowLabelTemplate;
  }

  public getName(): string {
    return 'Separator';
  }

  public getCaption(): string {
    return '/';
  }

  public getLabelTemplate(): ControlLabelTemplate {
    return this.rowLabelTemplate;
  }

  public getVisibility(): ControlVisibility {
    return ControlVisibility.Visible;
  }

  public getIsEditable(): boolean {
    return true;
  }
}

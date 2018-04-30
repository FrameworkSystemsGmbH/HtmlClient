import { IControlLabelProvider } from 'app/wrappers/control-labels/control-label-provider.interface';

import { ControlLabelTemplate } from 'app/wrappers/control-labels/control-label-template';
import { Visibility } from 'app/enums/visibility';

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

  public getVisibility(): Visibility {
    return Visibility.Visible;
  }

  public getIsEditable(): boolean {
    return true;
  }
}

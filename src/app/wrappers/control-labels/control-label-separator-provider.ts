import { Visibility } from '@app/enums/visibility';
import { IControlLabelProvider } from '@app/wrappers/control-labels/control-label-provider.interface';
import { ControlLabelTemplate } from '@app/wrappers/control-labels/control-label-template';

export class ControlLabelSeparatorProvider implements IControlLabelProvider {

  private readonly rowLabelTemplate: ControlLabelTemplate;

  public constructor(rowLabelTemplate: ControlLabelTemplate) {
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

  public getCurrentVisibility(): Visibility {
    return Visibility.Visible;
  }

  public getCurrentIsEditable(): boolean {
    return true;
  }
}

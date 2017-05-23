import { ContainerWrapper } from '.';
import { FieldContainer } from '../layout/field-layout';
import { LayoutableControlLabelTemplate } from '../layout';

export class FieldPanelWrapper extends ContainerWrapper implements FieldContainer {

  public getSynchronizeColumns(): boolean {
    return false;
  }

  public getRowLabelTemplate(): LayoutableControlLabelTemplate {
    return null;
  }

}

import { ContainerWrapper } from '.';
import { LayoutContainerSpaceable } from '../layout';

export abstract class ContainerWrapperSpaceable extends ContainerWrapper implements LayoutContainerSpaceable {

  public getSpacingHorizontal(): number {
    return this.propertyStore.getHorizontalSpacing();
  }

  public getSpacingVertical(): number {
    return this.propertyStore.getVerticalSpacing();
  }

}

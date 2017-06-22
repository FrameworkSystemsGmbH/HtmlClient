import { ContainerWrapper } from '.';
import { LayoutableContainerSpaceable } from '../layout';

export abstract class ContainerWrapperSpaceable extends ContainerWrapper implements LayoutableContainerSpaceable {

  public getSpacingHorizontal(): number {
    return this.propertyStore.getHorizontalSpacing();
  }

  public getSpacingVertical(): number {
    return this.propertyStore.getVerticalSpacing();
  }

}

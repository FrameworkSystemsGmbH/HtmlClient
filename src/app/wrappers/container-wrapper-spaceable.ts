import { ContainerWrapper } from '.';
import { LayoutableContainerSpaceable } from '../layout';

export abstract class ContainerWrapperSpaceable extends ContainerWrapper implements LayoutableContainerSpaceable {

  public getSpacingHorizontal(): number {
    return Number.zeroIfNull(this.propertyStore.getHorizontalSpacing());
  }

  public getSpacingVertical(): number {
    return Number.zeroIfNull(this.propertyStore.getVerticalSpacing());
  }

}

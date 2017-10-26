import { ContainerWrapper } from './container-wrapper';
import { ILayoutableContainerSpaceable } from '../layout/layoutable-container-spaceable';

export abstract class ContainerWrapperSpaceable extends ContainerWrapper implements ILayoutableContainerSpaceable {

  public getSpacingHorizontal(): number {
    return Number.zeroIfNull(this.propertyStore.getHorizontalSpacing());
  }

  public getSpacingVertical(): number {
    return Number.zeroIfNull(this.propertyStore.getVerticalSpacing());
  }

}

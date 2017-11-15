import { ILayoutableContainerSpaceable } from 'app/layout/layoutable-container-spaceable.interface';

import { ContainerWrapper } from 'app/wrappers/container-wrapper';

export abstract class ContainerWrapperSpaceable extends ContainerWrapper implements ILayoutableContainerSpaceable {

  public getSpacingHorizontal(): number {
    return Number.zeroIfNull(this.getPropertyStore().getHorizontalSpacing());
  }

  public getSpacingVertical(): number {
    return Number.zeroIfNull(this.getPropertyStore().getVerticalSpacing());
  }

}

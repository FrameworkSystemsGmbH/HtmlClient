import { ContainerWrapper } from '.';
import { LayoutableContainerSpaceable } from '../layout';

export abstract class ContainerWrapperSpaceable extends ContainerWrapper implements LayoutableContainerSpaceable {

  public getSpacingHorizontal(): number {
    return 0;
  }

  public getSpacingVertical(): number {
    return 0;
  }

}

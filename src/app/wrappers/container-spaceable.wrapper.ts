import { ContainerWrapper } from '.';
import { LayoutContainerSpaceable } from '../layout';

export abstract class ContainerWrapperSpaceable extends ContainerWrapper implements LayoutContainerSpaceable {

  public getSpacingHorizontal(): number {
    return 0;
  }

  public getSpacingVertical(): number {
    return 0;
  }

}

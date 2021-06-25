import { LayoutBase } from '@app/layout/layout-base';
import { ILayoutableContainer } from '@app/layout/layoutable-container.interface';

export abstract class LayoutContainerBase extends LayoutBase {

  public getControl(): ILayoutableContainer {
    return super.getControl() as ILayoutableContainer;
  }

  public abstract arrange(): void;

}

import { LayoutBase } from './layout-base';
import { ILayoutableContainer } from './layoutable-container';

export abstract class LayoutContainerBase extends LayoutBase {

  constructor(container: ILayoutableContainer) {
    super(container);
  }

  public getControl(): ILayoutableContainer {
    return super.getControl() as ILayoutableContainer;
  }

  public abstract arrange(): void;

}

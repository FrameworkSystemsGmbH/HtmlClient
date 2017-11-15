import { ILayoutableContainer } from 'app/layout/layoutable-container.interface';

import { LayoutBase } from 'app/layout/layout-base';

export abstract class LayoutContainerBase extends LayoutBase {

  constructor(container: ILayoutableContainer) {
    super(container);
  }

  public getControl(): ILayoutableContainer {
    return super.getControl() as ILayoutableContainer;
  }

  public abstract arrange(): void;

}

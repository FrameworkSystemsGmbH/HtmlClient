import { LayoutBase, LayoutableContainer } from '.';

export abstract class LayoutContainerBase extends LayoutBase {

  constructor(private container: LayoutableContainer) {
    super(container);
  }

  public getControl(): LayoutableContainer {
    return super.getControl() as LayoutableContainer;
  }

  public abstract arrange(): void;

}

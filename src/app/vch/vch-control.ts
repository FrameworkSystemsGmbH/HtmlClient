import { ILayoutableContainerWrapper } from '@app/wrappers/layout/layoutable-container-wrapper.interface';

export class VchControl {

  private parent: ILayoutableContainerWrapper;

  public getParent(): ILayoutableContainerWrapper {
    return this.parent;
  }

  public setParent(parent: ILayoutableContainerWrapper): void {
    this.parent = parent;
  }
}

import { ILayoutableContainerWrapper } from '@app/wrappers/layout/layoutable-container-wrapper.interface';

export class VchControl {

  private _parent: ILayoutableContainerWrapper;

  public getParent(): ILayoutableContainerWrapper {
    return this._parent;
  }

  public setParent(parent: ILayoutableContainerWrapper): void {
    this._parent = parent;
  }
}

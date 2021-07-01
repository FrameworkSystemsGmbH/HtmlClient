import { ILayoutableContainerWrapper } from '@app/wrappers/layout/layoutable-container-wrapper.interface';

export class VchControl {

  private _parent: ILayoutableContainerWrapper | null = null;

  public getParent(): ILayoutableContainerWrapper | null {
    return this._parent;
  }

  public setParent(parent: ILayoutableContainerWrapper | null): void {
    this._parent = parent;
  }
}

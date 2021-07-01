import { VchControl } from '@app/vch/vch-control';
import { ILayoutableContainerWrapper } from '@app/wrappers/layout/layoutable-container-wrapper.interface';
import { ILayoutableControlWrapper } from '@app/wrappers/layout/layoutable-control-wrapper.interface';

export class VchContainer extends VchControl {

  private readonly _children: Array<ILayoutableControlWrapper> = new Array<ILayoutableControlWrapper>();

  public constructor(private readonly _container: ILayoutableContainerWrapper) {
    super();
  }

  public getChildren(): Array<ILayoutableControlWrapper> {
    if (this._container.getInvertFlowDirection()) {
      const result: Array<ILayoutableControlWrapper> = this._children.clone();
      return result ? result.reverse() : result;
    } else {
      return this._children;
    }
  }

  public addChild(wrapper: ILayoutableControlWrapper): void {
    // Remove child from old parent first
    const oldParent: ILayoutableContainerWrapper | null = wrapper.getVchControl().getParent();

    if (oldParent) {
      oldParent.getVchContainer().removeChild(wrapper);
    }

    this._children.push(wrapper);

    wrapper.getVchControl().setParent(this._container);
  }

  public removeChild(wrapper: ILayoutableControlWrapper): void {
    wrapper.getVchControl().setParent(null);
    this._children.remove(wrapper);
  }
}

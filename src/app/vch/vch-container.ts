import { ILayoutableControlWrapper } from 'app/wrappers/layout/layoutable-control-wrapper.interface';
import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';

import { VchControl } from 'app/vch/vch-control';

export class VchContainer extends VchControl {

  private children: Array<ILayoutableControlWrapper> = new Array<ILayoutableControlWrapper>();

  constructor(private container: ILayoutableContainerWrapper) {
    super();
  }

  public getChildren(): Array<ILayoutableControlWrapper> {
    if (this.container.getInvertFlowDirection()) {
      const result: Array<ILayoutableControlWrapper> = this.children.clone();
      return result ? result.reverse() : result;
    } else {
      return this.children;
    }
  }

  public addChild(wrapper: ILayoutableControlWrapper): void {
    // Remove child from old parent first
    const oldParent: ILayoutableContainerWrapper = wrapper.getVchControl().getParent();

    if (oldParent) {
      oldParent.getVchContainer().removeChild(wrapper);
    }

    this.children.push(wrapper);

    wrapper.getVchControl().setParent(this.container);
  }

  public removeChild(wrapper: ILayoutableControlWrapper): void {
    wrapper.getVchControl().setParent(null);
    this.children.remove(wrapper);
  }
}

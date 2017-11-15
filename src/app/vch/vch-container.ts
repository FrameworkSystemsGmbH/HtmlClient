import { ILayoutableWrapper } from 'app/wrappers/layout/layoutable-wrapper.interface';
import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';

import { VchControl } from 'app/vch/vch-control';

export class VchContainer extends VchControl {

  private children: Array<ILayoutableWrapper> = new Array<ILayoutableWrapper>();

  constructor(private container: ILayoutableContainerWrapper) {
    super();
  }

  public getChildren(): Array<ILayoutableWrapper> {
    return this.children;
  }

  public getChildrenInFlowDirection(): Array<ILayoutableWrapper> {
    if (this.container.getInvertFlowDirection()) {
      const result: Array<ILayoutableWrapper> = this.children.clone();
      return result ? result.reverse() : result;
    } else {
      return this.children;
    }
  }

  public getChildrenCount(): number {
    return this.children.length;
  }

  public getChildAt(index: number): ILayoutableWrapper {
    return index < this.getChildrenCount() ? this.children[index] : null;
  }

  public addChild(wrapper: ILayoutableWrapper): void {
    // Remove child from old parent first
    const oldParent: ILayoutableContainerWrapper = wrapper.getVchControl().getParent();

    if (oldParent) {
      oldParent.getVchContainer().removeChild(wrapper);
    }

    this.children.push(wrapper);

    wrapper.getVchControl().setParent(this.container);
  }

  public removeChild(wrapper: ILayoutableWrapper): void {
    wrapper.getVchControl().setParent(null);
    this.children.remove(wrapper);
  }
}

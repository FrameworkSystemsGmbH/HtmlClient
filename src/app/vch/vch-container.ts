import { VchControl } from '.';
import { BaseWrapper, ContainerWrapper } from '../wrappers';

export class VchContainer extends VchControl {

  private children: Array<BaseWrapper> = new Array<BaseWrapper>();

  constructor(private container: ContainerWrapper) {
    super();
  }

  public getChildren(): Array<BaseWrapper> {
    return this.children;
  }

  public getChildrenInFlowDirection(): Array<BaseWrapper> {
    if (this.container.getInvertFlowDirection()) {
      let result: Array<BaseWrapper> = this.children.clone();
      return result ? result.reverse() : result;
    } else {
      return this.children;
    }
  }

  public getChildrenCount(): number {
    return this.children.length;
  }

  public getChildAt(index: number): BaseWrapper {
    return index < this.getChildrenCount() ? this.children[index] : null;
  }

  public addChild(wrapper: BaseWrapper): void {
    // Remove child from old parent first
    let oldParent: ContainerWrapper = wrapper.getVchControl().getParent();

    if (oldParent) {
      oldParent.getVchContainer().removeChild(wrapper);
    }

    this.children.push(wrapper);

    wrapper.getVchControl().setParent(this.container);
  }

  public removeChild(wrapper: BaseWrapper): void {
    this.children.remove(wrapper);
  }
}

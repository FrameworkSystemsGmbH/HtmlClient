import { VchControl } from './vch-control';
import { ControlWrapper } from '../wrappers/control-wrapper';
import { ContainerWrapper } from '../wrappers/container-wrapper';

export class VchContainer extends VchControl {

  private children: Array<ControlWrapper> = new Array<ControlWrapper>();

  constructor(private container: ContainerWrapper) {
    super();
  }

  public getChildren(): Array<ControlWrapper> {
    return this.children;
  }

  public getChildrenInFlowDirection(): Array<ControlWrapper> {
    if (this.container.getInvertFlowDirection()) {
      const result: Array<ControlWrapper> = this.children.clone();
      return result ? result.reverse() : result;
    } else {
      return this.children;
    }
  }

  public getChildrenCount(): number {
    return this.children.length;
  }

  public getChildAt(index: number): ControlWrapper {
    return index < this.getChildrenCount() ? this.children[index] : null;
  }

  public addChild(wrapper: ControlWrapper): void {
    // Remove child from old parent first
    const oldParent: ContainerWrapper = wrapper.getVchControl().getParent();

    if (oldParent) {
      oldParent.getVchContainer().removeChild(wrapper);
    }

    this.children.push(wrapper);

    wrapper.getVchControl().setParent(this.container);
  }

  public removeChild(wrapper: ControlWrapper): void {
    wrapper.getVchControl().setParent(null);
    this.children.remove(wrapper);
  }
}

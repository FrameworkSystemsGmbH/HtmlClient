import { ContainerWrapper } from '../wrappers/container-wrapper';

export class VchControl {

  private parent: ContainerWrapper;

  public getParent(): ContainerWrapper {
    return this.parent;
  }

  public setParent(parent: ContainerWrapper): void {
    this.parent = parent;
  }
}

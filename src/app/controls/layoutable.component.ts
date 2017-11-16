import { ILayoutableControlWrapper } from 'app/wrappers/layout/layoutable-control-wrapper.interface';

export abstract class LayoutableComponent {

  private wrapper: ILayoutableControlWrapper;

  public getWrapper(): ILayoutableControlWrapper {
    return this.wrapper;
  }

  public setWrapper(wrapper: ILayoutableControlWrapper): void {
    this.wrapper = wrapper;
  }

  public getName(): string {
    return this.getWrapper().getName();
  }
}

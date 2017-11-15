import { ILayoutableWrapper } from 'app/wrappers/layout/layoutable-wrapper.interface';

export abstract class LayoutableComponent {

  private wrapper: ILayoutableWrapper;

  public getWrapper(): ILayoutableWrapper {
    return this.wrapper;
  }

  public setWrapper(wrapper: ILayoutableWrapper): void {
    this.wrapper = wrapper;
  }

  public getName(): string {
    return this.getWrapper().getName();
  }
}

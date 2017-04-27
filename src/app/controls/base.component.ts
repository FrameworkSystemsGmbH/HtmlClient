import { BaseWrapper } from '../wrappers';

export abstract class BaseComponent {

  private wrapper: BaseWrapper;

  public getWrapper(): BaseWrapper {
    return this.wrapper;
  }

  public setWrapper(wrapper: BaseWrapper): void {
    this.wrapper = wrapper;
  }

  public getName(): string {
    return this.wrapper.getName();
  }

  public setName(name: string): void {
    this.wrapper.setName(name);
  }

  public setFocus(): void {
    // Has to be overridden in subclasses to take effect
  }

}

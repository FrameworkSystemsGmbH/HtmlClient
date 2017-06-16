import { BaseWrapper } from '../wrappers';
import { OnDestroy } from '@angular/core';

export abstract class BaseComponent implements OnDestroy {

  private wrapper: BaseWrapper;

  public ngOnDestroy(): void {
    this.wrapper.onComponentRefDestroyed();
  }

  public getWrapper(): BaseWrapper {
    return this.wrapper;
  }

  public setWrapper(wrapper: BaseWrapper): void {
    this.wrapper = wrapper;
  }

  public getName(): string {
    return this.wrapper.getName();
  }

  public setFocus(): void {
    // Has to be overridden in subclasses to take effect
  }

}

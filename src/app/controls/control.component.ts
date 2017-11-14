import { OnDestroy, Output, EventEmitter } from '@angular/core';

import { ControlWrapper } from '../wrappers/control-wrapper';

export abstract class ControlComponent implements OnDestroy {

  private wrapper: ControlWrapper;

  @Output()
  public onEnter: EventEmitter<any>;

  @Output()
  public onLeave: EventEmitter<any>;

  public ngOnDestroy(): void {
    this.getWrapper().onComponentRefDestroyed();
  }

  public callOnEnter(event: any): void {
    if (this.getWrapper().hasOnEnterEvent()) {
      this.onEnter.emit(event);
    }
  }

  public callOnLeave(event: any): void {
    if (this.getWrapper().hasOnLeaveEvent()) {
      this.onLeave.emit(event);
    }
  }

  public getWrapper(): ControlWrapper {
    return this.wrapper;
  }

  public setWrapper(wrapper: ControlWrapper): void {
    this.wrapper = wrapper;

    if (wrapper.hasOnEnterEvent()) {
      this.onEnter = new EventEmitter<any>();
    }

    if (wrapper.hasOnLeaveEvent()) {
      this.onLeave = new EventEmitter<any>();
    }
  }

  public getName(): string {
    return this.getWrapper().getName();
  }

  public updateComponent(): void {
    // Overridde in subclasses
  }

  public setFocus(): void {
    // Overridde in subclasses
  }

}

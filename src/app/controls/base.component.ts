import { OnDestroy, Output, EventEmitter } from '@angular/core';

import { BaseWrapper } from '../wrappers/base-wrapper';
import { ControlEvent } from '../enums/control-event';

export abstract class BaseComponent implements OnDestroy {

  private wrapper: BaseWrapper;

  @Output() onEnter: EventEmitter<any>;
  @Output() onLeave: EventEmitter<any>;

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

  public getWrapper(): BaseWrapper {
    return this.wrapper;
  }

  public setWrapper(wrapper: BaseWrapper): void {
    this.wrapper = wrapper;

    let events: ControlEvent = wrapper.getEvents();

    if (this.getWrapper().hasOnEnterEvent()) {
      this.onEnter = new EventEmitter<any>();
    }

    if (this.getWrapper().hasOnLeaveEvent()) {
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

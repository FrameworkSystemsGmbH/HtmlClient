import { BaseWrapper } from '../wrappers';
import { OnDestroy, Output, EventEmitter } from '@angular/core';
import { ControlEvent } from '../enums';

export abstract class BaseComponent implements OnDestroy {

  private wrapper: BaseWrapper;

  @Output() onEnter: EventEmitter<any>;
  @Output() onLeave: EventEmitter<any>;
  @Output() onDrag: EventEmitter<any>;
  @Output() onCanDrop: EventEmitter<any>;

  public ngOnDestroy(): void {
    this.getWrapper().onComponentRefDestroyed();
  }

  public callOnEnter(event: any): void {
    if (this.getWrapper().getEvents() & ControlEvent.OnEnter) {
      this.onEnter.emit(event);
    }
  }

  public callOnLeave(event: any): void {
    if (this.getWrapper().getEvents() & ControlEvent.OnLeave) {
      this.onLeave.emit(event);
    }
  }

  public callOnDrag(event: any): void {
    if (this.getWrapper().getEvents() & ControlEvent.OnDrag) {
      this.onDrag.emit(event);
    }
  }

  public callOnCanDrop(event: any): void {
    if (this.getWrapper().getEvents() & ControlEvent.OnCanDrop) {
      this.onCanDrop.emit(event);
    }
  }

  public getWrapper(): BaseWrapper {
    return this.wrapper;
  }

  public setWrapper(wrapper: BaseWrapper): void {
    this.wrapper = wrapper;

    let events: ControlEvent = wrapper.getEvents();

    if (events & ControlEvent.OnEnter) {
      this.onEnter = new EventEmitter<any>();
    }

    if (events & ControlEvent.OnLeave) {
      this.onLeave = new EventEmitter<any>();
    }

    if (events & ControlEvent.OnDrag) {
      this.onDrag = new EventEmitter<any>();
    }

    if (events & ControlEvent.OnCanDrop) {
      this.onCanDrop = new EventEmitter<any>();
    }

    this.onWrapperSet(wrapper);
  }

  protected onWrapperSet(wrapper: BaseWrapper): void {
    // Overridde in subclasses
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

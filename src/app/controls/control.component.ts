import { EventEmitter, Output } from '@angular/core';

import { ControlWrapper } from '../wrappers/control-wrapper';
import { LayoutableComponent } from 'app/controls/layoutable.component';

export abstract class ControlComponent extends LayoutableComponent {

  @Output()
  public onEnter: EventEmitter<any>;

  @Output()
  public onLeave: EventEmitter<any>;

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
    return super.getWrapper() as ControlWrapper;
  }

  public setWrapper(wrapper: ControlWrapper): void {
    super.setWrapper(wrapper);

    if (wrapper.hasOnEnterEvent()) {
      this.onEnter = new EventEmitter<any>();
    }

    if (wrapper.hasOnLeaveEvent()) {
      this.onLeave = new EventEmitter<any>();
    }
  }

  public updateComponent(): void {
    // Overridde in subclasses
  }

  public setFocus(): void {
    // Overridde in subclasses
  }
}

import { EventEmitter, Output } from '@angular/core';

import { ControlWrapper } from 'app/wrappers/control-wrapper';
import { LayoutableComponent } from 'app/controls/layoutable.component';

export abstract class ControlComponent extends LayoutableComponent {

  @Output()
  public onEnter: EventEmitter<any>;

  @Output()
  public onLeave: EventEmitter<any>;

  public callOnEnter(event: any): void {
    const wrapper: ControlWrapper = this.getWrapper();
    if (wrapper.getIsEditable() && this.getWrapper().hasOnEnterEvent()) {
      this.onEnter.emit(event);
    }
  }

  public callOnLeave(event: any): void {
    const wrapper: ControlWrapper = this.getWrapper();
    if (wrapper.getIsEditable() && wrapper.hasOnLeaveEvent()) {
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

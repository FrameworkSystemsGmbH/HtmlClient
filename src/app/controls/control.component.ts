import { EventEmitter, Output } from '@angular/core';

import { ControlWrapper } from 'app/wrappers/control-wrapper';
import { LayoutableComponent } from 'app/controls/layoutable.component';
import { Visibility } from 'app/enums/visibility';

export abstract class ControlComponent extends LayoutableComponent {

  @Output()
  public onEnter: EventEmitter<any>;

  @Output()
  public onLeave: EventEmitter<any>;

  public isVisible: boolean;
  public isEditable: boolean;

  public callOnEnter(event: any): void {
    if (this.isEditable && this.getWrapper().hasOnEnterEvent()) {
      this.onEnter.emit(event);
    }
  }

  public callOnLeave(event: any): void {
    if (this.isEditable && this.getWrapper().hasOnLeaveEvent()) {
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

  protected updateData(wrapper: ControlWrapper): void {
    super.updateData(wrapper);
    this.isVisible = wrapper.getVisibility() === Visibility.Visible;
    this.isEditable = wrapper.getIsEditable();
  }
}

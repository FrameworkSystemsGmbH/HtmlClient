import { Output, EventEmitter } from '@angular/core';

import { BaseComponent } from '.';
import { TextBoxBaseWrapper } from '../wrappers';
import { ControlEvent } from '../enums';

export abstract class TextBoxBaseComponent extends BaseComponent {

  @Output() onValidated: EventEmitter<any>;

  public callOnLeave(event: any): void {
    this.callOnValidated(event);
    super.callOnLeave(event);
  }

  public callOnValidated(event: any): void {
    if (this.getWrapper().getEvents() & ControlEvent.OnValidated) {
      this.onValidated.emit(event);
    }
  }

  public getWrapper(): TextBoxBaseWrapper {
    return super.getWrapper() as TextBoxBaseWrapper;
  }

  public setWrapper(wrapper: TextBoxBaseWrapper): void {
    super.setWrapper(wrapper);

    if (wrapper.getEvents() & ControlEvent.OnValidated) {
      this.onValidated = new EventEmitter<any>();
    }
  }
}

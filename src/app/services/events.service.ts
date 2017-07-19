import { EventEmitter, Injectable, } from '@angular/core';

import { BaseWrapper } from '../wrappers';
import { ControlEvent } from '../enums';
import { ClientEvent, ClientClickEvent } from '../common/events';

@Injectable()
export class EventsService {

  public readonly onEventFired: EventEmitter<ClientEvent> = new EventEmitter<ClientEvent>();

  public fireEnter(formId: string, controlName: string): void {

  }

  public fireLeave(formId: string, controlName: string): void {

  }

  public fireClick(formId: string, controlName: string): void {
    this.onEventFired.emit(new ClientClickEvent(formId, controlName));
  }

}

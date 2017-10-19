import { EventEmitter, Injectable, } from '@angular/core';

import { FocusService } from './focus.service';
import { ClientEvent } from '../common/events/client-event';
import { ClientEnterEvent } from '../common/events/client-enter-event';
import { ClientLeaveEvent } from '../common/events/client-leave-event';
import { ClientClickEvent } from '../common/events/client-click-event';
import { ClientCloseEvent } from '../common/events/client-close-event';
import { ClientDisposeEvent } from '../common/events/client-dispose-event';

export interface IEventsService {
  fireClick(formId: string, controlName: string): void;
  fireEnter(formId: string, controlName: string): void;
  fireLeave(formId: string, controlName: string, hasValueChanged: boolean): void;
  fireClose(formId: string): void;
  fireDispose(formId: string): void;
}

@Injectable()
export class EventsService implements IEventsService {

  public readonly onEventFired: EventEmitter<ClientEvent> = new EventEmitter<ClientEvent>();

  constructor(private focusService: FocusService) { }

  public fireClick(formId: string, controlName: string): void {
    this.onEventFired.emit(new ClientClickEvent(formId, controlName));
  }

  public fireEnter(formId: string, controlName: string): void {
    this.onEventFired.emit(new ClientEnterEvent(formId, controlName));
  }

  public fireLeave(formId: string, controlName: string, hasValueChanged: boolean): void {
    let activator: string = this.focusService.getLeaveActivator();
    this.onEventFired.emit(new ClientLeaveEvent(formId, controlName, activator, hasValueChanged));
  }

  public fireClose(formId: string): void {
    this.onEventFired.emit(new ClientCloseEvent(formId));
  }

  public fireDispose(formId: string): void {
    this.onEventFired.emit(new ClientDisposeEvent(formId));
  }
}

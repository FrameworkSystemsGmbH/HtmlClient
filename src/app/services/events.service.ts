import { EventEmitter, Injectable, } from '@angular/core';

import { ClientEvent, ClientClickEvent, ClientEnterEvent, ClientLeaveEvent, ClientCloseEvent, ClientDisposeEvent } from '../common/events';
import { FocusService } from './focus.service';

export interface IEventsService {
  fireEnter(formId: string, controlName: string): void;
  fireLeave(formId: string, controlName: string, hasValueChanged: boolean): void;
  fireDrag(formId: string, controlName: string): void;
  fireCanDrop(formId: string, controlName: string): void;
  fireClick(formId: string, controlName: string): void;
  fireClose(formId: string): void;
  fireDispose(formId: string): void;
}

@Injectable()
export class EventsService implements IEventsService {

  public readonly onEventFired: EventEmitter<ClientEvent> = new EventEmitter<ClientEvent>();

  constructor(private focusService: FocusService) { }

  public fireEnter(formId: string, controlName: string): void {
    this.onEventFired.emit(new ClientEnterEvent(formId, controlName));
  }

  public fireLeave(formId: string, controlName: string, hasValueChanged: boolean): void {
    let activator: string = this.focusService.getLeaveActivator();
    this.onEventFired.emit(new ClientLeaveEvent(formId, controlName, activator, hasValueChanged));
  }

  public fireDrag(formId: string, controlName: string): void {

  }

  public fireCanDrop(formId: string, controlName: string): void {

  }

  public fireClick(formId: string, controlName: string): void {
    this.onEventFired.emit(new ClientClickEvent(formId, controlName));
  }

  public fireClose(formId: string): void {
    this.onEventFired.emit(new ClientCloseEvent(formId));
  }

  public fireDispose(formId: string): void {
    this.onEventFired.emit(new ClientDisposeEvent(formId));
  }
}

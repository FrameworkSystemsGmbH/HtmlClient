import { EventEmitter, Injectable, } from '@angular/core';

import { BaseWrapper } from '../wrappers';
import { ControlEvent } from '../enums';
import { Queue } from '../util';
import { ClientEvent, ClientClickEvent, ClientEnterEvent, ClientLeaveEvent, ClientCloseEvent, ClientDisposeEvent } from '../common/events';
import { FocusService } from './focus.service';

@Injectable()
export class EventsService {

  public readonly onEventFired: EventEmitter<any> = new EventEmitter<any>();

  private readonly eventQueue: Queue<ClientEvent> = new Queue<ClientEvent>();

  constructor(private focusService: FocusService) { }

  public getNextEvent(): ClientEvent {
    return this.eventQueue.dequeue();
  }

  public fireEnter(formId: string, controlName: string): void {
    this.eventQueue.enqueue(new ClientEnterEvent(formId, controlName));
    this.onEventFired.emit();
  }

  public fireLeave(formId: string, controlName: string, hasValueChanged: boolean): void {
    let activator: string = this.focusService.getLeaveActivator();
    this.eventQueue.enqueue(new ClientLeaveEvent(formId, controlName, activator, hasValueChanged));
    this.onEventFired.emit();
  }

  public fireDrag(formId: string, controlName: string): void {

  }

  public fireCanDrop(formId: string, controlName: string): void {

  }

  public fireClick(formId: string, controlName: string): void {
    this.eventQueue.enqueue(new ClientClickEvent(formId, controlName));
    this.onEventFired.emit();
  }

  public fireClose(formId: string): void {
    this.eventQueue.enqueue(new ClientCloseEvent(formId));
    this.onEventFired.emit();
  }

  public fireDispose(formId: string) {
    this.eventQueue.enqueue(new ClientDisposeEvent(formId));
    this.onEventFired.emit();
  }
}

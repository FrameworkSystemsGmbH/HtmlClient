import { EventEmitter, Injectable, } from '@angular/core';

import { BaseWrapper } from '../wrappers';
import { ControlEvent } from '../enums';
import { Queue } from '../util';
import { ClientEvent, ClientClickEvent, ClientEnterEvent, ClientLeaveEvent } from '../common/events';

@Injectable()
export class EventsService {

  public readonly onEventFired: EventEmitter<any> = new EventEmitter<any>();

  private readonly eventQueue: Queue<ClientEvent> = new Queue<ClientEvent>();

  public getNextEvent(): ClientEvent {
    return this.eventQueue.dequeue();
  }

  public fireEnter(formId: string, controlName: string): void {
    this.eventQueue.enqueue(new ClientEnterEvent(formId, controlName));
    this.onEventFired.emit();
  }

  public fireLeave(formId: string, controlName: string, hasValueChanged: boolean): void {
    this.eventQueue.enqueue(new ClientLeaveEvent(formId, controlName, hasValueChanged));
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
}

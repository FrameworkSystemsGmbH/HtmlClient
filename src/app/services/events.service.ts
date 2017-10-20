import { EventEmitter, Injectable, } from '@angular/core';

import { InternalEvent } from '../common/internal-event';
import { InternalEventCallbacks } from '../common/internal-event-callbacks';
import { ClientClickEvent } from '../common/events/client-click-event';
import { ClientValidatedEvent } from '../common/events/client-validated-event';
import { ClientEnterEvent } from '../common/events/client-enter-event';
import { ClientLeaveEvent } from '../common/events/client-leave-event';
import { ClientCloseEvent } from '../common/events/client-close-event';
import { ClientDisposeEvent } from '../common/events/client-dispose-event';

export interface IEventsService {
  fireClick(
    formId: string,
    controlName: string,
    callbacks: InternalEventCallbacks
  ): void;

  fireValidated(
    formId: string,
    controlName: string,
    callbacks: InternalEventCallbacks
  ): void;

  fireEnter(
    formId: string,
    controlName: string,
    callbacks: InternalEventCallbacks
  ): void;

  fireLeave(
    formId: string,
    controlName: string,
    activator: string,
    hasValueChanged: boolean,
    callbacks: InternalEventCallbacks
  ): void;

  fireClose(
    formId: string,
    callbacks: InternalEventCallbacks
  ): void;

  fireDispose(
    formId: string,
    callbacks: InternalEventCallbacks
  ): void;
}

@Injectable()
export class EventsService implements IEventsService {

  public readonly onHandleEvent: EventEmitter<InternalEvent> = new EventEmitter<InternalEvent>();

  public fireClick(
    formId: string,
    controlName: string,
    callbacks: InternalEventCallbacks): void {
    this.onHandleEvent.emit({
      clientEvent: new ClientClickEvent(formId, controlName),
      callbacks: callbacks
    });
  }

  public fireValidated(
    formId: string,
    controlName: string,
    callbacks: InternalEventCallbacks): void {
    this.onHandleEvent.emit({
      clientEvent: new ClientValidatedEvent(formId, controlName),
      callbacks: callbacks
    });
  }

  public fireEnter(
    formId: string,
    controlName: string,
    callbacks: InternalEventCallbacks): void {
    this.onHandleEvent.emit({
      clientEvent: new ClientEnterEvent(formId, controlName),
      callbacks: callbacks
    });
  }

  public fireLeave(
    formId: string,
    controlName: string,
    activator: string,
    hasValueChanged: boolean,
    callbacks: InternalEventCallbacks): void {
    this.onHandleEvent.emit({
      clientEvent: new ClientLeaveEvent(formId, controlName, activator, hasValueChanged),
      callbacks: callbacks
    });
  }

  public fireClose(
    formId: string,
    callbacks: InternalEventCallbacks): void {
    this.onHandleEvent.emit({
      clientEvent: new ClientCloseEvent(formId),
      callbacks: callbacks
    });
  }

  public fireDispose(
    formId: string,
    callbacks: InternalEventCallbacks): void {
    this.onHandleEvent.emit({
      clientEvent: new ClientDisposeEvent(formId),
      callbacks: callbacks
    });
  }
}

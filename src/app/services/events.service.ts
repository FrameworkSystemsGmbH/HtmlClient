import { EventEmitter, Injectable } from '@angular/core';

import { InternalEvent } from '../common/events/internal/internal-event';
import { InternalEventCallbacks } from '../common/events/internal/internal-event-callbacks';
import { ClientEvent } from '../common/events/client-event';
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
    originalEvent: any,
    callbacks: InternalEventCallbacks<ClientClickEvent>
  ): void;

  fireValidated(
    formId: string,
    controlName: string,
    originalEvent: any,
    callbacks: InternalEventCallbacks<ClientValidatedEvent>
  ): void;

  fireEnter(
    formId: string,
    controlName: string,
    originalEvent: any,
    callbacks: InternalEventCallbacks<ClientEnterEvent>
  ): void;

  fireLeave(
    formId: string,
    controlName: string,
    activator: string,
    hasValueChanged: boolean,
    originalEvent: any,
    callbacks: InternalEventCallbacks<ClientLeaveEvent>
  ): void;

  fireClose(
    formId: string,
    callbacks: InternalEventCallbacks<ClientCloseEvent>
  ): void;

  fireDispose(
    formId: string,
    callbacks: InternalEventCallbacks<ClientDisposeEvent>
  ): void;
}

@Injectable()
export class EventsService implements IEventsService {

  public readonly onHandleEvent: EventEmitter<InternalEvent<ClientEvent>> = new EventEmitter<InternalEvent<ClientEvent>>();

  public fireClick(
    formId: string,
    controlName: string,
    originalEvent: any,
    callbacks: InternalEventCallbacks<ClientClickEvent>): void {
    this.onHandleEvent.emit({
      originalEvent,
      clientEvent: new ClientClickEvent(formId, controlName),
      callbacks
    });
  }

  public fireValidated(
    formId: string,
    controlName: string,
    originalEvent: any,
    callbacks: InternalEventCallbacks<ClientValidatedEvent>): void {
    this.onHandleEvent.emit({
      originalEvent,
      clientEvent: new ClientValidatedEvent(formId, controlName),
      callbacks
    });
  }

  public fireEnter(
    formId: string,
    controlName: string,
    originalEvent: any,
    callbacks: InternalEventCallbacks<ClientEnterEvent>): void {
    this.onHandleEvent.emit({
      originalEvent,
      clientEvent: new ClientEnterEvent(formId, controlName),
      callbacks
    });
  }

  public fireLeave(
    formId: string,
    controlName: string,
    activator: string,
    hasValueChanged: boolean,
    originalEvent: any,
    callbacks: InternalEventCallbacks<ClientLeaveEvent>): void {
    this.onHandleEvent.emit({
      originalEvent,
      clientEvent: new ClientLeaveEvent(formId, controlName, activator, hasValueChanged),
      callbacks
    });
  }

  public fireClose(
    formId: string,
    callbacks: InternalEventCallbacks<ClientCloseEvent>): void {
    this.onHandleEvent.emit({
      originalEvent: null,
      clientEvent: new ClientCloseEvent(formId),
      callbacks
    });
  }

  public fireDispose(
    formId: string,
    callbacks: InternalEventCallbacks<ClientDisposeEvent>): void {
    this.onHandleEvent.emit({
      originalEvent: null,
      clientEvent: new ClientDisposeEvent(formId),
      callbacks
    });
  }
}

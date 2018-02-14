import { EventEmitter, Injectable } from '@angular/core';

import { InternalEvent } from 'app/common/events/internal/internal-event';
import { InternalEventCallbacks } from 'app/common/events/internal/internal-event-callbacks';
import { ClientEvent } from 'app/common/events/client-event';
import { ClientClickEvent } from 'app/common/events/client-click-event';
import { ClientValidatedEvent } from 'app/common/events/client-validated-event';
import { ClientSelectionChangedEvent } from 'app/common/events/client-selection-changed-event';
import { ClientEnterEvent } from 'app/common/events/client-enter-event';
import { ClientLeaveEvent } from 'app/common/events/client-leave-event';
import { ClientCloseEvent } from 'app/common/events/client-close-event';
import { ClientDisposeEvent } from 'app/common/events/client-dispose-event';
import { ClientMsgBoxEvent } from 'app/common/events/client-msgbox-event';

@Injectable()
export class EventsService {

  public readonly onHandleEvent: EventEmitter<InternalEvent<ClientEvent>> = new EventEmitter<InternalEvent<ClientEvent>>();

  public fireClick(
    formId: string,
    controlName: string,
    originalEvent: any,
    callbacks: InternalEventCallbacks<ClientClickEvent>): void {
    this.onHandleEvent.emit({
      originalEvent,
      clientEvent: new ClientClickEvent(controlName, formId),
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
      clientEvent: new ClientValidatedEvent(controlName, formId),
      callbacks
    });
  }

  public fireSelectionChanged(
    formId: string,
    controlName: string,
    originalEvent: any,
    callbacks: InternalEventCallbacks<ClientSelectionChangedEvent>): void {
    this.onHandleEvent.emit({
      originalEvent,
      clientEvent: new ClientSelectionChangedEvent(controlName, formId),
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
      clientEvent: new ClientEnterEvent(controlName, formId),
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
      clientEvent: new ClientLeaveEvent(controlName, formId, activator, hasValueChanged),
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

  public fireMsgBox(
    formId: string,
    id: string,
    action: string,
    originalEvent: any): void {
    this.onHandleEvent.emit({
      originalEvent,
      clientEvent: new ClientMsgBoxEvent(formId, id, action)
    });
  }
}

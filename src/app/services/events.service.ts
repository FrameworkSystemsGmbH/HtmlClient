import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { InternalEvent } from 'app/common/events/internal/internal-event';
import { InternalEventCallbacks } from 'app/common/events/internal/internal-event-callbacks';
import { ClientApplicationQuitEvent } from 'app/common/events/client-application-quit-event';
import { ClientApplicationQuitRequestEvent } from 'app/common/events/client-application-quit-request-event';
import { ClientEvent } from 'app/common/events/client-event';
import { ClientClickEvent } from 'app/common/events/client-click-event';
import { ClientValidatedEvent } from 'app/common/events/client-validated-event';
import { ClientSelectionChangedEvent } from 'app/common/events/client-selection-changed-event';
import { ClientEnterEvent } from 'app/common/events/client-enter-event';
import { ClientLeaveEvent } from 'app/common/events/client-leave-event';
import { ClientCloseEvent } from 'app/common/events/client-close-event';
import { ClientDisposeEvent } from 'app/common/events/client-dispose-event';
import { ClientItemActivatedEvent } from 'app/common/events/client-item-activated-event';
import { ClientItemSelectionChangedEvent } from 'app/common/events/client-item-selection-changed-event';
import { BarcodeFormat } from 'app/enums/barcode-format';
import { ClientBarcodeScannedEvent } from 'app/common/events/client-barcode-scanned-event';

@Injectable()
export class EventsService {

  private readonly _eventFired: Subject<InternalEvent<ClientEvent>>;
  private readonly _eventFiredObs: Observable<InternalEvent<ClientEvent>>;

  constructor() {
    this._eventFired = new Subject<InternalEvent<ClientEvent>>();
    this._eventFiredObs = this._eventFired.asObservable();
  }

  public get eventFired(): Observable<InternalEvent<ClientEvent>> {
    return this._eventFiredObs;
  }

  public fireClick(
    formId: string,
    controlName: string,
    originalEvent: any,
    callbacks: InternalEventCallbacks<ClientClickEvent>): void {
    this._eventFired.next({
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
    this._eventFired.next({
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
    this._eventFired.next({
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
    this._eventFired.next({
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
    this._eventFired.next({
      originalEvent,
      clientEvent: new ClientLeaveEvent(controlName, formId, activator, hasValueChanged),
      callbacks
    });
  }

  public fireItemSelectionChanged(
    formId: string,
    controlName: string,
    originalEvent: any,
    callbacks: InternalEventCallbacks<ClientItemSelectionChangedEvent>): void {
    this._eventFired.next({
      originalEvent,
      clientEvent: new ClientItemSelectionChangedEvent(controlName, formId),
      callbacks
    });
  }

  public fireItemActivated(
    formId: string,
    controlName: string,
    itemId: string,
    itemIndex: number,
    originalEvent: any,
    callbacks: InternalEventCallbacks<ClientItemActivatedEvent>): void {
    this._eventFired.next({
      originalEvent,
      clientEvent: new ClientItemActivatedEvent(controlName, formId, itemId, itemIndex),
      callbacks
    });
  }

  public fireClose(
    formId: string,
    callbacks: InternalEventCallbacks<ClientCloseEvent>): void {
    this._eventFired.next({
      originalEvent: null,
      clientEvent: new ClientCloseEvent(formId),
      callbacks
    });
  }

  public fireDispose(
    formId: string,
    callbacks: InternalEventCallbacks<ClientDisposeEvent>): void {
    this._eventFired.next({
      originalEvent: null,
      clientEvent: new ClientDisposeEvent(formId),
      callbacks
    });
  }

  public fireApplicationQuitRequest(): void {
    this._eventFired.next({
      originalEvent: null,
      clientEvent: new ClientApplicationQuitRequestEvent()
    });
  }

  public fireApplicationQuit(restartRequested: boolean): void {
    this._eventFired.next({
      originalEvent: null,
      clientEvent: new ClientApplicationQuitEvent(restartRequested)
    });
  }

  public fireBarcodeScanned(cancelled: boolean, hasError: boolean, errorMessage: string, value: string, format: BarcodeFormat) {
    this._eventFired.next({
      originalEvent: null,
      clientEvent: new ClientBarcodeScannedEvent(cancelled, hasError, errorMessage, value, format)
    });
  }
}

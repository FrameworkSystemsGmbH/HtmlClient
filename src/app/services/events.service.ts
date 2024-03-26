import { Injectable } from '@angular/core';
import { ClientApplicationQuitEvent } from '@app/common/events/client-application-quit-event';
import { ClientApplicationQuitRequestEvent } from '@app/common/events/client-application-quit-request-event';
import { ClientBarcodeScannedEvent } from '@app/common/events/client-barcode-scanned-event';
import { ClientClickEvent } from '@app/common/events/client-click-event';
import { ClientCloseEvent } from '@app/common/events/client-close-event';
import { ClientDisposeEvent } from '@app/common/events/client-dispose-event';
import { ClientEnterEvent } from '@app/common/events/client-enter-event';
import { ClientEvent } from '@app/common/events/client-event';
import { ClientGotGeoLocationEvent } from '@app/common/events/client-got-geo-location-event';
import { ClientItemActivatedEvent } from '@app/common/events/client-item-activated-event';
import { ClientItemSelectionChangedEvent } from '@app/common/events/client-item-selection-changed-event';
import { ClientLeaveEvent } from '@app/common/events/client-leave-event';
import { ClientPhotoTakenEvent } from '@app/common/events/client-photo-taken-event';
import { ClientPictureClickEvent } from '@app/common/events/client-picture-click-event';
import { ClientSelectedTabPageChangeEvent } from '@app/common/events/client-selected-tab-page-change-event';
import { ClientSelectedTabPageChangedEvent } from '@app/common/events/client-selected-tab-page-changed-event';
import { ClientSelectionChangedEvent } from '@app/common/events/client-selection-changed-event';
import { ClientValidatedEvent } from '@app/common/events/client-validated-event';
import { ClientPictureClickEventArgs } from '@app/common/events/eventargs/client-picture-click-eventargs';
import { InternalEvent } from '@app/common/events/internal/internal-event';
import { InternalEventCallbacks } from '@app/common/events/internal/internal-event-callbacks';
import { BarcodeFormat } from '@app/enums/barcode-format';
import { Observable, Subject } from 'rxjs';

/** Hat für jedes Event eine Fire Methode.
 * Vermutlich das pendant zum HandleEvent im Java.
 */
@Injectable({ providedIn: 'root' })
export class EventsService {

  private readonly _eventFired: Subject<InternalEvent<ClientEvent>>;
  private readonly _eventFiredObs: Observable<InternalEvent<ClientEvent>>;

  public constructor() {
    this._eventFired = new Subject<InternalEvent<ClientEvent>>();
    this._eventFiredObs = this._eventFired.asObservable();
  }

  public get eventFired(): Observable<InternalEvent<ClientEvent>> {
    return this._eventFiredObs;
  }

  public fireClick(
    formId: string,
    controlName: string,
    callbacks: InternalEventCallbacks
  ): void {
    const event: InternalEvent<ClientClickEvent> = new InternalEvent<ClientClickEvent>(new ClientClickEvent(controlName, formId));
    event.callbacks = callbacks;
    this._eventFired.next(event);
  }

  public firePictureClick(
    formId: string,
    controlName: string,
    args: ClientPictureClickEventArgs,
    callbacks: InternalEventCallbacks
  ): void {
    const event: InternalEvent<ClientPictureClickEvent> = new InternalEvent<ClientPictureClickEvent>(new ClientPictureClickEvent(controlName, formId, args));
    event.callbacks = callbacks;
    this._eventFired.next(event);
  }

  public fireEnter(
    formId: string,
    controlName: string,
    callbacks: InternalEventCallbacks
  ): void {
    const event: InternalEvent<ClientEnterEvent> = new InternalEvent<ClientEnterEvent>(new ClientEnterEvent(controlName, formId));
    event.callbacks = callbacks;
    this._eventFired.next(event);
  }

  public fireLeave(
    formId: string,
    controlName: string,
    activator: string,
    hasValueChanged: boolean,
    callbacks: InternalEventCallbacks
  ): void {
    const event: InternalEvent<ClientLeaveEvent> = new InternalEvent<ClientLeaveEvent>(new ClientLeaveEvent(controlName, formId, activator, hasValueChanged));
    event.callbacks = callbacks;
    this._eventFired.next(event);
  }

  public fireValidated(
    formId: string,
    controlName: string,
    callbacks: InternalEventCallbacks
  ): void {
    const event: InternalEvent<ClientValidatedEvent> = new InternalEvent<ClientValidatedEvent>(new ClientValidatedEvent(controlName, formId));
    event.callbacks = callbacks;
    this._eventFired.next(event);
  }

  public fireSelectionChanged(
    formId: string,
    controlName: string,
    callbacks: InternalEventCallbacks
  ): void {
    const event: InternalEvent<ClientSelectionChangedEvent> = new InternalEvent<ClientSelectionChangedEvent>(new ClientSelectionChangedEvent(controlName, formId));
    event.callbacks = callbacks;
    this._eventFired.next(event);
  }

  public fireItemSelectionChanged(
    formId: string,
    controlName: string,
    callbacks: InternalEventCallbacks
  ): void {
    const event: InternalEvent<ClientItemSelectionChangedEvent> = new InternalEvent<ClientItemSelectionChangedEvent>(new ClientItemSelectionChangedEvent(controlName, formId));
    event.callbacks = callbacks;
    this._eventFired.next(event);
  }

  public fireItemActivated(
    formId: string,
    controlName: string,
    itemId: string,
    itemIndex: number,
    callbacks: InternalEventCallbacks
  ): void {
    const event: InternalEvent<ClientItemActivatedEvent> = new InternalEvent<ClientItemActivatedEvent>(new ClientItemActivatedEvent(controlName, formId, itemId, itemIndex));
    event.callbacks = callbacks;
    this._eventFired.next(event);
  }

  public fireClose(
    formId: string,
    callbacks: InternalEventCallbacks
  ): void {
    const event: InternalEvent<ClientCloseEvent> = new InternalEvent<ClientCloseEvent>(new ClientCloseEvent(formId));
    event.callbacks = callbacks;
    this._eventFired.next(event);
  }

  public fireDispose(
    formId: string,
    callbacks: InternalEventCallbacks
  ): void {
    const event: InternalEvent<ClientDisposeEvent> = new InternalEvent<ClientDisposeEvent>(new ClientDisposeEvent(formId));
    event.callbacks = callbacks;
    this._eventFired.next(event);
  }

  public fireApplicationQuitRequest(): void {
    this._eventFired.next(new InternalEvent<ClientApplicationQuitRequestEvent>(new ClientApplicationQuitRequestEvent()));
  }

  public fireApplicationQuit(restartRequested: boolean): void {
    this._eventFired.next(new InternalEvent<ClientApplicationQuitRequestEvent>(new ClientApplicationQuitEvent(restartRequested)));
  }

  public fireBarcodeScanned(
    cancelled?: boolean,
    hasError?: boolean,
    errorMessage?: string,
    value?: string,
    format?: BarcodeFormat
  ): void {
    this._eventFired.next(new InternalEvent<ClientBarcodeScannedEvent>(new ClientBarcodeScannedEvent(cancelled, hasError, errorMessage, value, format)));
  }

  public firePhotoTaken(
    hasError?: boolean,
    errorMessage?: string,
    imageData?: string
  ): void {
    const event: InternalEvent<ClientPhotoTakenEvent> = new InternalEvent<ClientPhotoTakenEvent>(new ClientPhotoTakenEvent(hasError, errorMessage, imageData));
    this._eventFired.next(event);
  }

  public fireGotGeoLocation(
    hasError?: boolean,
    errorMessage?: string,
    latitude?: number,
    longitude?: number,
    altitude?: number,
    accuracy?: number,
    heading?: number,
    speed?: number,
    timestamp?: number
  ): void {
    this._eventFired.next(new InternalEvent<ClientGotGeoLocationEvent>(new ClientGotGeoLocationEvent(hasError, errorMessage, latitude, longitude, altitude, accuracy, heading, speed, timestamp)));
  }

  public fireSelectedTabPageChange(
    formId: string,
    controlName: string,
    lastTab: string,
    selectedTab: string,
    payload: any,
    callbacks: InternalEventCallbacks
  ): void {
    const event: InternalEvent<ClientSelectedTabPageChangeEvent> = new InternalEvent<ClientSelectedTabPageChangeEvent>(new ClientSelectedTabPageChangeEvent(controlName, formId, lastTab, selectedTab));
    event.callbacks = callbacks;
    event.payload = payload;
    this._eventFired.next(event);
  }

  public fireSelectedTabPageChanged(
    formId: string,
    controlName: string,
    lastTab: string,
    selectedTab: string,
    callbacks: InternalEventCallbacks
  ): void {
    const event: InternalEvent<ClientSelectedTabPageChangedEvent> = new InternalEvent<ClientSelectedTabPageChangedEvent>(new ClientSelectedTabPageChangedEvent(controlName, formId, lastTab, selectedTab));
    event.callbacks = callbacks;
    this._eventFired.next(event);
  }
}

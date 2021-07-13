import { Injectable, NgZone } from '@angular/core';
import { EventsService } from '@app/services/events.service';
import { Geolocation, Position } from '@capacitor/geolocation';

@Injectable({ providedIn: 'root' })
export class GeoLocationService {

  private readonly _zone: NgZone;
  private readonly _eventsService: EventsService;

  private _hasError?: boolean;
  private _errorMessage?: string;
  private _timestamp?: number;
  private _latitude?: number;
  private _longitude?: number;
  private _accuracy?: number;
  private _altitude?: number;
  private _heading?: number;
  private _speed?: number;

  public constructor(
    zone: NgZone,
    eventsService: EventsService
  ) {
    this._zone = zone;
    this._eventsService = eventsService;
  }

  public getGeoLocation(): void {
    Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      maximumAge: 3000,
      timeout: 5000
    }).then(this.onSuccess.bind(this))
      .catch(this.onError.bind(this));
  }

  private onSuccess(position: Position): void {
    this._zone.run(() => {
      this.reset();
      this._latitude = position.coords.latitude;
      this._longitude = position.coords.longitude;
      this._accuracy = position.coords.accuracy;
      this._altitude = position.coords.altitude != null ? position.coords.altitude : undefined;
      this._heading = position.coords.heading != null ? position.coords.heading : undefined;
      this._speed = position.coords.speed != null ? position.coords.speed : undefined;
      this._timestamp = position.timestamp;
      this.fireGotGeoLocation();
    });
  }

  private onError(error: any): void {
    this._zone.run(() => {
      this.reset();
      this._hasError = true;

      if (error != null && error.message != null && error.message.trim().length > 0) {
        const message: string = error.message;

        if (message.match(/denied location permission/i) != null) {
          this._errorMessage = 'User denied required permissions!';
        } else if (message.match(/location unavailable/i) != null) {
          this._errorMessage = 'Unable to retrieve device position via network or GPS!';
        } else {
          this._errorMessage = error.message;
        }
      } else {
        this._errorMessage = 'An unknown error occured!';
      }

      this.fireGotGeoLocation();
    });
  }

  private reset(): void {
    this._hasError = false;
    this._errorMessage = undefined;
  }

  private fireGotGeoLocation(): void {
    this._eventsService.fireGotGeoLocation(this._hasError, this._errorMessage, this._timestamp, this._latitude, this._longitude, this._accuracy, this._altitude, this._heading, this._speed);
  }
}

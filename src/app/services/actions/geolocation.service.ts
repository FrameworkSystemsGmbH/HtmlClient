import { Injectable, NgZone } from '@angular/core';
import { EventsService } from 'app/services/events.service';
import { PlatformService } from 'app/services/platform.service';

@Injectable()
export class GeoLocationService {

  private _hasError: boolean;
  private _errorMessage: string;
  private _latitude: number;
  private _longitude: number;
  private _altitude: number;
  private _accuracy: number;
  private _heading: number;
  private _speed: number;
  private _timestamp: number;

  constructor(
    private _zone: NgZone,
    private _eventsService: EventsService,
    private _platformService: PlatformService
  ) { }

  public getGeoLocation(): void {
    if (this._platformService.isNative()) {
      navigator.geolocation.getCurrentPosition(this.onSuccess.bind(this), this.onError.bind(this), {
        enableHighAccuracy: true,
        maximumAge: 3000,
        timeout: 5000
      });
    }
  }

  private onSuccess(position: Position): void {
    this._zone.run(() => {
      this.reset();
      this._latitude = position.coords.latitude;
      this._longitude = position.coords.longitude;
      this._altitude = position.coords.altitude;
      this._accuracy = position.coords.accuracy;
      this._heading = position.coords.heading;
      this._speed = position.coords.speed;
      this._timestamp = position.timestamp;
      this.fireGotGeoLocation();
    });
  }

  private onError(error: PositionError): void {
    this._zone.run(() => {
      this.reset();
      this._hasError = true;

      switch (error.code) {
        case error.PERMISSION_DENIED:
          this._errorMessage = 'Permission denied by user!';
          break;
        case error.POSITION_UNAVAILABLE:
          this._errorMessage = 'Unable to retrieve device position via network or GPS!';
          break;
        case error.TIMEOUT:
          this._errorMessage = 'Timeout: Could not retrieve device position!';
          break;
        default:
          this._errorMessage = error.message;
          break;
      }

      this.fireGotGeoLocation();
    });
  }

  private reset(): void {
    this._hasError = null;
    this._errorMessage = null;
  }

  private fireGotGeoLocation(): void {
    this._eventsService.fireGotGeoLocation(this._hasError, this._errorMessage, this._latitude, this._longitude, this._altitude, this._accuracy, this._heading, this._speed, this._timestamp);
  }
}

import { Injectable, NgZone } from '@angular/core';
import { EventsService } from '@app/services/events.service';
import { GeolocationPosition, Plugins } from '@capacitor/core';

const { Geolocation } = Plugins;

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

  public constructor(
    private readonly _zone: NgZone,
    private readonly _eventsService: EventsService
  ) { }

  public getGeoLocation(): void {
    Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      maximumAge: 3000,
      timeout: 5000
    }).then(this.onSuccess.bind(this))
      .catch(this.onError.bind(this));
  }

  private onSuccess(position: GeolocationPosition): void {
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

  private onError(error: any): void {
    this._zone.run(() => {
      this.reset();
      this._hasError = true;

      if (error != null && !String.isNullOrWhiteSpace(error.message)) {
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
    this._hasError = null;
    this._errorMessage = null;
  }

  private fireGotGeoLocation(): void {
    this._eventsService.fireGotGeoLocation(this._hasError, this._errorMessage, this._latitude, this._longitude, this._altitude, this._accuracy, this._heading, this._speed, this._timestamp);
  }
}

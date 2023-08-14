import { Injectable, NgZone } from '@angular/core';
import { EventsService } from '@app/services/events.service';
import { PlatformService } from '@app/services/platform.service';
import { Geolocation, Position } from '@capacitor/geolocation';
import { from, map, mergeMap, of, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GeoLocationService {

  private readonly _zone: NgZone;
  private readonly _eventsService: EventsService;
  private readonly _platformService: PlatformService;

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
    eventsService: EventsService,
    platformService: PlatformService
  ) {
    this._zone = zone;
    this._eventsService = eventsService;
    this._platformService = platformService;
  }

  public getGeoLocation(): void {
    from(Geolocation.checkPermissions()).pipe(
      map(permissionStatus => permissionStatus.location),
      mergeMap(permission => {
        if (!this._platformService.isNative()) {
          // Permissions cannot be checked in the browser
          // Just return 'granted' and let the browser do the rest
          return of('granted');
        } else if (permission === 'prompt' || permission === 'prompt-with-rationale') {
          return from(Geolocation.requestPermissions({ permissions: ['location'] })).pipe(
            map(permissionStatus => permissionStatus.location)
          );
        } else {
          return of(permission);
        }
      }),
      mergeMap(permission => {
        if (permission === 'granted') {
          return from(Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            maximumAge: 3000,
            timeout: 5000
          }));
        } else {
          throw new Error('User denied required permissions!');
        }
      }),
      take(1)
    ).subscribe({
      next: position => this.onSuccess(position),
      error: err => this.onError(Error.ensureError(err))
    });
  }

  private onSuccess(position: Position): void {
    this._zone.run(() => {
      this.reset();
      this._latitude = position.coords.latitude;
      this._longitude = position.coords.longitude;
      this._accuracy = position.coords.accuracy;
      this._altitude = position.coords.altitude ?? undefined;
      this._heading = position.coords.heading ?? undefined;
      this._speed = position.coords.speed ?? undefined;
      this._timestamp = position.timestamp;
      this.fireGotGeoLocation();
    });
  }

  private onError(error: Error): void {
    this._zone.run(() => {
      this.reset();
      this._hasError = true;

      const message: string = error.message;

      if (message.trim().length > 0) {
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
    this._eventsService.fireGotGeoLocation(this._hasError, this._errorMessage, this._latitude, this._longitude, this._accuracy, this._altitude, this._heading, this._speed, this._timestamp);
  }
}

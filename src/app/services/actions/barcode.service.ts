import { Injectable } from '@angular/core';
import { BarcodeFormat } from '@app/enums/barcode-format';
import { EventsService } from '@app/services/events.service';
import { PlatformService } from '@app/services/platform.service';
import { RoutingService } from '@app/services/routing.service';
import { Camera } from '@capacitor/camera';
import { from, map, mergeMap, of, take } from 'rxjs';

/** Wird nur im Android unterstützt, aber nicht im Browser. */
@Injectable({ providedIn: 'root' })
export class BarcodeService {

  private readonly _eventsService: EventsService;
  private readonly _platformService: PlatformService;
  private readonly _routingService: RoutingService;

  private _wantedFormat: BarcodeFormat = BarcodeFormat.ALL;

  private _cancelled?: boolean;
  private _hasError?: boolean;
  private _errorMessage?: string;
  private _value?: string;
  private _scannedFormat?: BarcodeFormat;

  public constructor(
    eventsService: EventsService,
    platformService: PlatformService,
    routingService: RoutingService
  ) {
    this._eventsService = eventsService;
    this._platformService = platformService;
    this._routingService = routingService;
  }

  //Funktioniert nur im Android.
  public scan(format: BarcodeFormat): void {
    if (this._platformService.isNative() && format !== BarcodeFormat.NONE) {
      from(Camera.checkPermissions()).pipe(
        map(permissionStatus => permissionStatus.camera),
        mergeMap(permission => {
          if (permission === 'prompt' || permission === 'prompt-with-rationale') {
            return from(Camera.requestPermissions({ permissions: ['camera'] })).pipe(
              map(permissionStatus => permissionStatus.camera)
            );
          } else {
            return of(permission);
          }
        }),
        take(1)
      ).subscribe({
        next: permission => {
          if (permission === 'granted') {
            this._wantedFormat = format;
            this._routingService.showBarcodeScanner();
          } else {
            this.onError(new Error('User denied required permissions!'));
          }
        },
        error: err => this.onError(Error.ensureError(err))
      });
    }
  }

  public getWantedFormat(): BarcodeFormat {
    return this._wantedFormat;
  }

  public onSuccess(value: string | undefined, format: BarcodeFormat | undefined): void {
    this.reset();

    this._value = value;
    this._scannedFormat = format;

    this.fireBarcodeScanned();
  }

  public onCancelled(): void {
    this.reset();
    this._cancelled = true;
    this.fireBarcodeScanned();
  }

  public onError(error: Error): void {
    this.reset();

    this._hasError = true;
    this._errorMessage = error.message;

    this.fireBarcodeScanned();
  }

  private reset(): void {
    this._cancelled = undefined;
    this._hasError = undefined;
    this._errorMessage = undefined;
    this._value = undefined;
    this._scannedFormat = undefined;
    this._wantedFormat = BarcodeFormat.ALL;
  }

  private fireBarcodeScanned(): void {
    this._routingService.showViewer();
    this._eventsService.fireBarcodeScanned(this._cancelled, this._hasError, this._errorMessage, this._value, this._scannedFormat);
  }
}

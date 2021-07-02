import { Injectable, NgZone } from '@angular/core';
import { BrokerCameraSource } from '@app/enums/broker-camera-source';
import { EventsService } from '@app/services/events.service';
import { IAppState } from '@app/store/app.state';
import { selectBrokerName } from '@app/store/broker/broker.selectors';
import { AppRestoredResult, CameraDirection, CameraResultType, CameraSource, Plugins } from '@capacitor/core';
import { Store } from '@ngrx/store';

const { Camera } = Plugins;

@Injectable({ providedIn: 'root' })
export class CameraService {

  private readonly _zone: NgZone;
  private readonly _store: Store<IAppState>;
  private readonly _eventsService: EventsService;

  private _hasError?: boolean;
  private _errorMessage?: string;
  private _imageData?: string;
  private _brokerName: string | null = null;
  private _pendingResult: AppRestoredResult | null = null;

  public constructor(
    zone: NgZone,
    store: Store<IAppState>,
    eventsService: EventsService
  ) {
    this._zone = zone;
    this._store = store;
    this._eventsService = eventsService;

    this._store.select(selectBrokerName).subscribe(brokerName => {
      this._brokerName = brokerName != null ? brokerName : null;
    });
  }

  public takePhoto(source: BrokerCameraSource): void {
    Camera.getPhoto({
      allowEditing: false,
      direction: CameraDirection.Rear,
      correctOrientation: true,
      quality: 100,
      resultType: CameraResultType.Base64,
      saveToGallery: true,
      source: source === BrokerCameraSource.CAMERA ? CameraSource.Camera : CameraSource.Photos
    }).then(img => {
      if (img.base64String != null) {
        this.onSuccess(img.base64String);
      } else {
        this.onError('Could not retrieve image data!');
      }
    }).catch(err => {
      if (typeof err === 'string') {
        this.onError(err);
      } else {
        this.onError(err.message);
      }
    });
  }

  private onSuccess(base64img: string): void {
    this._zone.run(() => {
      this.reset();
      this._imageData = base64img;
      this.firePhotoTaken();
    });
  }

  private onError(message: string): void {
    this._zone.run(() => {
      this.reset();
      this._hasError = true;

      if (!String.isNullOrWhiteSpace(message)) {
        if (message.match(/cancelled photos app/i) != null) {
          this._errorMessage = 'Process cancelled by user!';
        } else if (message.match(/denied permission request/i) != null) {
          this._errorMessage = 'User denied required permissions!';
        } else {
          this._errorMessage = message;
        }
      } else {
        this._errorMessage = 'An unknown error occured!';
      }

      this.firePhotoTaken();
    });
  }

  public setPendingResult(result: AppRestoredResult): void {
    this._pendingResult = result;
  }

  public processPendingResult(): void {
    if (!String.isNullOrWhiteSpace(this._brokerName) && this._pendingResult != null) {
      if (this._pendingResult.success) {
        if (this._pendingResult.data != null && !String.isNullOrWhiteSpace(this._pendingResult.data.base64String)) {
          this.onSuccess(this._pendingResult.data.base64String);
        } else {
          this.onError('Pending image data is missing!');
        }
      } else if (this._pendingResult.error != null && !String.isNullOrWhiteSpace(this._pendingResult.error.message)) {
        this.onError(this._pendingResult.error.message);
      } else {
        this.onError('Pending error message is missing!');
      }
    }

    this._pendingResult = null;
  }

  private reset(): void {
    this._hasError = undefined;
    this._errorMessage = undefined;
    this._imageData = undefined;
  }

  private firePhotoTaken(): void {
    this._eventsService.firePhotoTaken(this._hasError, this._errorMessage, this._imageData);
  }
}

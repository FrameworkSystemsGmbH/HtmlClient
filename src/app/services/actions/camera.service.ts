import { Injectable, NgZone } from '@angular/core';
import { Plugins, CameraDirection, CameraResultType, CameraSource, CameraPhoto } from '@capacitor/core';
import { EventsService } from 'app/services/events.service';
import { BrokerCameraSource } from 'app/enums/broker-camera-source';

const { Camera } = Plugins;

@Injectable()
export class CameraService {

  private _hasError: boolean;
  private _errorMessage: string;
  private _imageData: string;

  constructor(
    private _zone: NgZone,
    private _eventsService: EventsService
  ) { }

  public takePhoto(source: BrokerCameraSource): void {
    Camera.getPhoto({
      allowEditing: false,
      direction: CameraDirection.Rear,
      correctOrientation: true,
      quality: 100,
      resultType: CameraResultType.Base64,
      saveToGallery: true,
      source: source === BrokerCameraSource.CAMERA ? CameraSource.Camera : CameraSource.Photos
    }).then(this.onSuccess.bind(this))
      .catch(this.onError.bind(this));
  }

  private onSuccess(img: CameraPhoto): void {
    this._zone.run(() => {
      this.reset();
      this._imageData = img.base64String;
      this.firePhotoTaken();
    });
  }

  public onPendingSuccess(base64string: string): void {
    this._zone.run(() => {
      this.reset();
      this._imageData = base64string;
      this.firePhotoTaken();
    });
  }

  private onError(error: { message: string }): void {
    this._zone.run(() => {
      this.reset();
      this._hasError = true;

      if (error != null && !String.isNullOrWhiteSpace(error.message)) {
        const message: string = error.message;

        if (message.match(/cancelled photos app/i) != null) {
          this._errorMessage = 'Process cancelled by user!';
        } else if (message.match(/denied permission request/i) != null) {
          this._errorMessage = 'User denied required permissions!';
        } else {
          this._errorMessage = error.message;
        }
      } else {
        this._errorMessage = 'An unknown error occured!';
      }

      this.firePhotoTaken();
    });
  }

  public onPendingError(message: string): void {
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

  private reset(): void {
    this._hasError = null;
    this._errorMessage = null;
    this._imageData = null;
  }

  private firePhotoTaken(): void {
    this._eventsService.firePhotoTaken(this._hasError, this._errorMessage, this._imageData);
  }
}

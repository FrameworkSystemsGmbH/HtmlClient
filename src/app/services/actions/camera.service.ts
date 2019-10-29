/// <reference types="cordova-plugin-camera" />

import { Injectable, NgZone } from '@angular/core';
import { EventsService } from 'app/services/events.service';
import { PlatformService } from 'app/services/platform/platform.service';
import { CameraSource } from 'app/enums/camera-source';

@Injectable()
export class CameraService {

  private _hasError: boolean;
  private _errorMessage: string;
  private _imageData: string;

  constructor(
    private _zone: NgZone,
    private _eventsService: EventsService,
    private _platformService: PlatformService
  ) { }

  public takePhoto(source: CameraSource): void {
    if (this._platformService.isMobile()) {
      navigator.camera.getPicture(this.onSuccess.bind(this), this.onError.bind(this),
        {
          allowEdit: false,
          cameraDirection: Camera.Direction.BACK,
          correctOrientation: true,
          destinationType: Camera.DestinationType.DATA_URL,
          encodingType: Camera.EncodingType.JPEG,
          mediaType: Camera.MediaType.PICTURE,
          quality: 100,
          saveToPhotoAlbum: true,
          sourceType: source
        });
    }
  }

  private onSuccess(imageData: any): void {
    this._zone.run(() => {
      this.reset();
      this._imageData = imageData;
      this.firePhotoTaken();
    });
  }

  private onError(error: string | number): void {
    this._zone.run(() => {
      this.reset();
      this._hasError = true;

      const num: number = Number(error);

      if (isNaN(num)) {
        this._errorMessage = error as string;
      } else if (num === 20) {
        this._errorMessage = 'Permission denied by user!';
      } else {
        this._errorMessage = `Could not retrieve photo (error code ${num})`;
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

  public processPendingResult(pendingResult: any): void {
    if (pendingResult == null) {
      this.onError('Pending resume result missing');
    } else if (pendingResult.pluginServiceName !== 'Camera') {
      this.onError('Cannot handle pending resume result of plugin \'' + pendingResult.pluginServiceName + '\'');
    } else if (pendingResult.pluginStatus == null) {
      this.onError('Pending resume result status missing');
    } else if (pendingResult.pluginStatus !== 'OK') {
      this.onError(pendingResult.result);
    } else {
      this.onSuccess(pendingResult.result);
    }
  }
}

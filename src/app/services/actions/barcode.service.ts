import { Injectable, NgZone } from '@angular/core';
import { BarcodeFormat } from '@app/enums/barcode-format';
import { EventsService } from '@app/services/events.service';
import { PlatformService } from '@app/services/platform.service';

@Injectable({ providedIn: 'root' })
export class BarcodeService {

  private _cancelled?: boolean;
  private _hasError?: boolean;
  private _errorMessage?: string;
  private _value?: string;
  private _format?: BarcodeFormat;

  public constructor(
    private readonly _zone: NgZone,
    private readonly _eventsService: EventsService,
    private readonly _platformService: PlatformService
  ) { }

  public scan(format: BarcodeFormat): void {
    if (this._platformService.isNative() && format !== BarcodeFormat.NONE) {
      (window as any).cordova.plugins.barcodeScanner.scan(this.onSuccess.bind(this), this.onError.bind(this), {
        prompt: '',
        disableSuccessBeep: true,
        resultDisplayDuration: 0,
        formats: this.buildFormatString(format)
      });
    }
  }

  private onSuccess(result: any): void {
    this._zone.run(() => {
      this.reset();
      if (result.cancelled) {
        this._cancelled = true;
      } else {
        this._value = result.text;
        this._format = result.format;
      }
      this.fireBarcodeScanned();
    });
  }

  private onError(error: string): void {
    this._zone.run(() => {
      this.reset();
      this._hasError = true;
      this._errorMessage = error;
      this.fireBarcodeScanned();
    });
  }

  private reset(): void {
    this._cancelled = undefined;
    this._hasError = undefined;
    this._errorMessage = undefined;
    this._value = undefined;
    this._format = undefined;
  }

  private fireBarcodeScanned(): void {
    this._eventsService.fireBarcodeScanned(this._cancelled, this._hasError, this._errorMessage, this._value, this._format);
  }

  private buildFormatString(format: BarcodeFormat): string {
    const formats: Array<string> = new Array<string>();

    if ((format & BarcodeFormat.AZTEC) === BarcodeFormat.AZTEC) {
      formats.push(BarcodeFormat[BarcodeFormat.AZTEC]);
    }

    if ((format & BarcodeFormat.CODABAR) === BarcodeFormat.CODABAR) {
      formats.push(BarcodeFormat[BarcodeFormat.CODABAR]);
    }

    if ((format & BarcodeFormat.CODE_128) === BarcodeFormat.CODE_128) {
      formats.push(BarcodeFormat[BarcodeFormat.CODE_128]);
    }

    if ((format & BarcodeFormat.CODE_39) === BarcodeFormat.CODE_39) {
      formats.push(BarcodeFormat[BarcodeFormat.CODE_39]);
    }

    if ((format & BarcodeFormat.CODE_93) === BarcodeFormat.CODE_93) {
      formats.push(BarcodeFormat[BarcodeFormat.CODE_93]);
    }

    if ((format & BarcodeFormat.DATA_MATRIX) === BarcodeFormat.DATA_MATRIX) {
      formats.push(BarcodeFormat[BarcodeFormat.DATA_MATRIX]);
    }

    if ((format & BarcodeFormat.EAN_13) === BarcodeFormat.EAN_13) {
      formats.push(BarcodeFormat[BarcodeFormat.EAN_13]);
    }

    if ((format & BarcodeFormat.EAN_8) === BarcodeFormat.EAN_8) {
      formats.push(BarcodeFormat[BarcodeFormat.EAN_8]);
    }

    if ((format & BarcodeFormat.ITF) === BarcodeFormat.ITF) {
      formats.push(BarcodeFormat[BarcodeFormat.ITF]);
    }

    if ((format & BarcodeFormat.PDF_417) === BarcodeFormat.PDF_417) {
      formats.push(BarcodeFormat[BarcodeFormat.PDF_417]);
    }

    if ((format & BarcodeFormat.QR_CODE) === BarcodeFormat.QR_CODE) {
      formats.push(BarcodeFormat[BarcodeFormat.QR_CODE]);
    }

    if ((format & BarcodeFormat.UPC_A) === BarcodeFormat.UPC_A) {
      formats.push(BarcodeFormat[BarcodeFormat.UPC_A]);
    }

    if ((format & BarcodeFormat.UPC_E) === BarcodeFormat.UPC_E) {
      formats.push(BarcodeFormat[BarcodeFormat.UPC_E]);
    }

    return formats.join(',');
  }
}

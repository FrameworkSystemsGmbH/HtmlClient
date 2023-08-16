import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { BackButtonPriority } from '@app/enums/backbutton-priority';
import { BarcodeFormat } from '@app/enums/barcode-format';
import { BarcodeService } from '@app/services/actions/barcode.service';
import { BackService } from '@app/services/back-service';
import { BarcodeScanner, CameraDirection, SupportedFormat } from '@capacitor-community/barcode-scanner';
import { from, Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'hc-barcode',
  templateUrl: './barcode.component.html',
  styleUrls: ['./barcode.component.scss']
})
export class BarcodeComponent implements OnInit, OnDestroy {

  private readonly _zone: NgZone;
  private readonly _backService: BackService;
  private readonly _barcodeService: BarcodeService;

  private _scanSub: Subscription | null = null;

  private _onBackButtonListener: (() => boolean) | null = null;

  public constructor(
    zone: NgZone,
    backService: BackService,
    barcodeService: BarcodeService
  ) {
    this._zone = zone;
    this._backService = backService;
    this._barcodeService = barcodeService;
  }

  public ngOnInit(): void {
    this._onBackButtonListener = this.onBackButton.bind(this);
    this._backService.addBackButtonListener(this._onBackButtonListener, BackButtonPriority.Overlay);

    const format: BarcodeFormat = this._barcodeService.getWantedFormat();

    this._scanSub = from(BarcodeScanner.startScan({
      cameraDirection: CameraDirection.BACK,
      targetedFormats: this.getSupportedFormats(format)
    })).subscribe({
      next: result => {
        this._zone.run(() => {
          this._barcodeService.onSuccess(result.content, this.getScannedFormat(result.format));
        });
      },
      error: err => {
        this._zone.run(() => {
          this._barcodeService.onError(Error.ensureError(err));
        });
      }
    });
  }

  public ngOnDestroy(): void {
    this._scanSub?.unsubscribe();

    if (this._onBackButtonListener) {
      this._backService.removeBackButtonListener(this._onBackButtonListener);
    }
  }

  private onBackButton(): boolean {
    void BarcodeScanner.stopScan();
    this._barcodeService.onCancelled();
    return true;
  }

  private getSupportedFormats(format: BarcodeFormat): Array<SupportedFormat> {
    const formats: Array<SupportedFormat> = new Array<SupportedFormat>();

    if ((format & BarcodeFormat.AZTEC) === BarcodeFormat.AZTEC.valueOf()) {
      formats.push(SupportedFormat.AZTEC);
    }

    if ((format & BarcodeFormat.CODABAR) === BarcodeFormat.CODABAR.valueOf()) {
      formats.push(SupportedFormat.CODABAR);
    }

    if ((format & BarcodeFormat.CODE_128) === BarcodeFormat.CODE_128.valueOf()) {
      formats.push(SupportedFormat.CODE_128);
    }

    if ((format & BarcodeFormat.CODE_39) === BarcodeFormat.CODE_39.valueOf()) {
      formats.push(SupportedFormat.CODE_39);
    }

    if ((format & BarcodeFormat.CODE_93) === BarcodeFormat.CODE_93.valueOf()) {
      formats.push(SupportedFormat.CODE_93);
    }

    if ((format & BarcodeFormat.DATA_MATRIX) === BarcodeFormat.DATA_MATRIX.valueOf()) {
      formats.push(SupportedFormat.DATA_MATRIX);
    }

    if ((format & BarcodeFormat.EAN_13) === BarcodeFormat.EAN_13.valueOf()) {
      formats.push(SupportedFormat.EAN_13);
    }

    if ((format & BarcodeFormat.EAN_8) === BarcodeFormat.EAN_8.valueOf()) {
      formats.push(SupportedFormat.EAN_8);
    }

    if ((format & BarcodeFormat.ITF) === BarcodeFormat.ITF.valueOf()) {
      formats.push(SupportedFormat.ITF);
    }

    if ((format & BarcodeFormat.PDF_417) === BarcodeFormat.PDF_417.valueOf()) {
      formats.push(SupportedFormat.PDF_417);
    }

    if ((format & BarcodeFormat.QR_CODE) === BarcodeFormat.QR_CODE.valueOf()) {
      formats.push(SupportedFormat.QR_CODE);
    }

    if ((format & BarcodeFormat.UPC_A) === BarcodeFormat.UPC_A.valueOf()) {
      formats.push(SupportedFormat.UPC_A);
    }

    if ((format & BarcodeFormat.UPC_E) === BarcodeFormat.UPC_E.valueOf()) {
      formats.push(SupportedFormat.UPC_E);
    }

    return formats;
  }

  private getScannedFormat(format: string | undefined): BarcodeFormat | undefined {
    if (format == null) {
      return undefined;
    }

    if (format === SupportedFormat.AZTEC) {
      return BarcodeFormat.AZTEC;
    }

    if (format === SupportedFormat.CODABAR) {
      return BarcodeFormat.CODABAR;
    }

    if (format === SupportedFormat.CODE_128) {
      return BarcodeFormat.CODE_128;
    }

    if (format === SupportedFormat.CODE_39) {
      return BarcodeFormat.CODE_39;
    }

    if (format === SupportedFormat.CODE_93) {
      return BarcodeFormat.CODE_93;
    }

    if (format === SupportedFormat.DATA_MATRIX) {
      return BarcodeFormat.DATA_MATRIX;
    }

    if (format === SupportedFormat.EAN_13) {
      return BarcodeFormat.EAN_13;
    }

    if (format === SupportedFormat.EAN_8) {
      return BarcodeFormat.EAN_8;
    }

    if (format === SupportedFormat.ITF) {
      return BarcodeFormat.ITF;
    }

    if (format === SupportedFormat.PDF_417) {
      return BarcodeFormat.PDF_417;
    }

    if (format === SupportedFormat.QR_CODE) {
      return BarcodeFormat.QR_CODE;
    }

    if (format === SupportedFormat.UPC_A) {
      return BarcodeFormat.UPC_A;
    }

    if (format === SupportedFormat.UPC_E) {
      return BarcodeFormat.UPC_E;
    }

    return undefined;
  }
}

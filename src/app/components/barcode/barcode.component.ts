import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { BackButtonPriority } from '@app/enums/backbutton-priority';
import { BarcodeFormat as FSBarcodeFormat } from '@app/enums/barcode-format';
import { BarcodeService } from '@app/services/actions/barcode.service';
import { BackService } from '@app/services/back-service';
import { BarcodeScanner, LensFacing, BarcodeFormat, BarcodesScannedEvent } from '@capacitor-mlkit/barcode-scanning';
import { from, Subscription } from 'rxjs';

/** Die Component ist einfach nur ein Overlay. Hinter das Template wird das Video gesetzt.
Der Barcode läuft anders als die Kamera ab, dort wird ein Barcode-Scanner in eine
Angular-Component reingehängt.
Das Viereck, wo den Scannbereich anzeigt, wird gemalt.
Wenn ich einen BarcodeScanner möchte, dann wird in die barcode-route gegangen
und dann wieder zurück in die viewer-component.
*/

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

    const format: FSBarcodeFormat = this._barcodeService.getWantedFormat();
    this._scanSub = from(BarcodeScanner.addListener('barcodesScanned', this.barcodeScanned.bind(this))).subscribe({
      error: err => {
        this._zone.run(() => {
          this._barcodeService.onError(Error.ensureError(err));
        })
      }
    });

    BarcodeScanner.startScan({
      lensFacing: LensFacing.Back,
      formats: this.getSupportedFormats(format)
    });
  }

  private barcodeScanned(event: BarcodesScannedEvent): void {
    if (event != null && event.barcodes.length > 0) {
      this._barcodeService.onSuccess(event.barcodes[0].rawValue, this.getScannedFormat(event.barcodes[0].format));
      void BarcodeScanner.stopScan();
    }
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

  private getSupportedFormats(format: FSBarcodeFormat): Array<BarcodeFormat> {
    const formats: Array<BarcodeFormat> = new Array<BarcodeFormat>();

    if ((format & FSBarcodeFormat.AZTEC) === FSBarcodeFormat.AZTEC.valueOf()) {
      formats.push(BarcodeFormat.Aztec);
    }

    if ((format & FSBarcodeFormat.CODABAR) === FSBarcodeFormat.CODABAR.valueOf()) {
      formats.push(BarcodeFormat.Codabar);
    }

    if ((format & FSBarcodeFormat.CODE_128) === FSBarcodeFormat.CODE_128.valueOf()) {
      formats.push(BarcodeFormat.Code128);
    }

    if ((format & FSBarcodeFormat.CODE_39) === FSBarcodeFormat.CODE_39.valueOf()) {
      formats.push(BarcodeFormat.Code39);
    }

    if ((format & FSBarcodeFormat.CODE_93) === FSBarcodeFormat.CODE_93.valueOf()) {
      formats.push(BarcodeFormat.Code93);
    }

    if ((format & FSBarcodeFormat.DATA_MATRIX) === FSBarcodeFormat.DATA_MATRIX.valueOf()) {
      formats.push(BarcodeFormat.DataMatrix);
    }

    if ((format & FSBarcodeFormat.EAN_13) === FSBarcodeFormat.EAN_13.valueOf()) {
      formats.push(BarcodeFormat.Ean13);
    }

    if ((format & FSBarcodeFormat.EAN_8) === FSBarcodeFormat.EAN_8.valueOf()) {
      formats.push(BarcodeFormat.Ean8);
    }

    if ((format & FSBarcodeFormat.ITF) === FSBarcodeFormat.ITF.valueOf()) {
      formats.push(BarcodeFormat.Itf);
    }

    if ((format & FSBarcodeFormat.PDF_417) === FSBarcodeFormat.PDF_417.valueOf()) {
      formats.push(BarcodeFormat.Pdf417);
    }

    if ((format & FSBarcodeFormat.QR_CODE) === FSBarcodeFormat.QR_CODE.valueOf()) {
      formats.push(BarcodeFormat.QrCode);
    }

    if ((format & FSBarcodeFormat.UPC_A) === FSBarcodeFormat.UPC_A.valueOf()) {
      formats.push(BarcodeFormat.UpcA);
    }

    if ((format & FSBarcodeFormat.UPC_E) === FSBarcodeFormat.UPC_E.valueOf()) {
      formats.push(BarcodeFormat.UpcE);
    }

    return formats;
  }

  private getScannedFormat(format: string | undefined): FSBarcodeFormat | undefined {
    if (format == null) {
      return undefined;
    }

    if (format === BarcodeFormat.Aztec) {
      return FSBarcodeFormat.AZTEC;
    }

    if (format === BarcodeFormat.Codabar) {
      return FSBarcodeFormat.CODABAR;
    }

    if (format === BarcodeFormat.Code128) {
      return FSBarcodeFormat.CODE_128;
    }

    if (format === BarcodeFormat.Code39) {
      return FSBarcodeFormat.CODE_39;
    }

    if (format === BarcodeFormat.Code93) {
      return FSBarcodeFormat.CODE_93;
    }

    if (format === BarcodeFormat.DataMatrix) {
      return FSBarcodeFormat.DATA_MATRIX;
    }

    if (format === BarcodeFormat.Ean13) {
      return FSBarcodeFormat.EAN_13;
    }

    if (format === BarcodeFormat.Ean8) {
      return FSBarcodeFormat.EAN_8;
    }

    if (format === BarcodeFormat.Itf) {
      return FSBarcodeFormat.ITF;
    }

    if (format === BarcodeFormat.Pdf417) {
      return FSBarcodeFormat.PDF_417;
    }

    if (format === BarcodeFormat.QrCode) {
      return FSBarcodeFormat.QR_CODE;
    }

    if (format === BarcodeFormat.UpcA) {
      return FSBarcodeFormat.UPC_A;
    }

    if (format === BarcodeFormat.UpcE) {
      return FSBarcodeFormat.UPC_E;
    }

    return undefined;
  }
}

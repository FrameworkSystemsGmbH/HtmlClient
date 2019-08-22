import { BarcodeFormat } from 'app/enums/barcode-format';

export class ClientBarcodeScannedEventArgs {

  protected cancelled: boolean;
  protected hasError: boolean;
  protected errorMessage: string;
  protected value: string;
  protected format: BarcodeFormat;

  constructor(cancelled: boolean, hasError: boolean, errorMessage: string, value: string, format: BarcodeFormat) {
    this.cancelled = cancelled;
    this.hasError = hasError;
    this.errorMessage = errorMessage;
    this.value = value;
    this.format = format;
  }
}

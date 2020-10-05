import { ClientEvent } from '@app/common/events/client-event';
import { ClientBarcodeScannedEventArgs } from '@app/common/events/eventargs/client-barcode-scanned-eventargs';
import { BarcodeFormat } from '@app/enums/barcode-format';
import { ClientEventType } from '@app/enums/client-event-type';

export class ClientBarcodeScannedEvent extends ClientEvent {

  protected args: ClientBarcodeScannedEventArgs;

  constructor(cancelled: boolean, hasError: boolean, errorMessage: string, value: string, format: BarcodeFormat) {
    super(ClientEventType[ClientEventType.BarcodeScanned]);
    this.args = new ClientBarcodeScannedEventArgs(cancelled, hasError, errorMessage, value, format);
  }
}

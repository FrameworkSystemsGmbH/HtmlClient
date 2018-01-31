import { OverlayRef } from '@angular/cdk/overlay';

export class ErrorBoxRef {

  constructor(private overlayRef: OverlayRef) { }

  public close(): void {
    this.overlayRef.dispose();
  }
}

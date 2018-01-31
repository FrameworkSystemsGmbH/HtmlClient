import { OverlayRef } from '@angular/cdk/overlay';

export class MsgBoxRef {

  constructor(private overlayRef: OverlayRef) { }

  public close(): void {
    this.overlayRef.dispose();
  }
}

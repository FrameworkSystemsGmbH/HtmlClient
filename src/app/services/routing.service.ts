import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RoutingService {

  private readonly _router: Router;

  public constructor(router: Router) {
    this._router = router;
  }

  public showLogin(): void {
    if (this._router.routerState.snapshot.url !== '/') {
      void this._router.navigate(['/'], { skipLocationChange: true });
    }
  }

  public showViewer(): void {
    if (this._router.routerState.snapshot.url !== '/viewer') {
      void this._router.navigate(['/viewer'], { skipLocationChange: true });
    }
  }

  public showBarcodeScanner(): void {
    if (this._router.routerState.snapshot.url !== '/barcode') {
      void this._router.navigate(['/barcode'], { skipLocationChange: true });
    }
  }
}

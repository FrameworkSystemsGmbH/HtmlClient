import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RoutingService {

  private readonly _router = inject(Router);

  public showLogin(): void {
    if (this._router.routerState.snapshot.url !== '/') {
      void this._router.navigate(['/'], { skipLocationChange: true });
    }
  }

  public showViewer(): void {
    if (this._router.routerState.snapshot.url !== '/viewer') {
      // Das navigate ist ein Promise von Angular
      // Durch das "void" ist es ein FireAndForget Promise, welches jedoch synchron(!) ausgeführt wird.
      // Ansonsten würde der Focus setzen evtl vor Viewer-Navigation stattfinden, das darf nicht passieren.
      void this._router.navigate(['/viewer'], { skipLocationChange: true });
    }
  }

  public showBarcodeScanner(): void {
    if (this._router.routerState.snapshot.url !== '/barcode') {
      void this._router.navigate(['/barcode'], { skipLocationChange: true });
    }
  }
}

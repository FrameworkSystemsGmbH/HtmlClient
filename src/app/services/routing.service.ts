import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class RoutingService {

  public constructor(private readonly _router: Router) { }

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
}

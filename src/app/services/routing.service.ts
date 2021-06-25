import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class RoutingService {

  public constructor(private readonly router: Router) { }

  public showLogin(): void {
    if (this.router.routerState.snapshot.url !== '/') {
      void this.router.navigate(['/'], { skipLocationChange: true });
    }
  }

  public showViewer(): void {
    if (this.router.routerState.snapshot.url !== '/viewer') {
      void this.router.navigate(['/viewer'], { skipLocationChange: true });
    }
  }
}

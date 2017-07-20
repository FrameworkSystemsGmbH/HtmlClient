import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class RoutingService {

  constructor(private router: Router) { }

  public showLogin(): void {
    if (this.router.routerState.snapshot.url !== '/') {
      this.router.navigate(['/'], { skipLocationChange: true });
    }
  }

  public showViewer(): void {
    if (this.router.routerState.snapshot.url !== '/viewer') {
      this.router.navigate(['/viewer'], { skipLocationChange: true });
    }
  }

}

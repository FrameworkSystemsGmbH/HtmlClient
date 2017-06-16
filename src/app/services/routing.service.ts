import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class RoutingService {

  constructor(private router: Router) { }

  public showLogin(): void {
    this.router.navigate(['/'], { skipLocationChange: true });
  }

  public showViewer(): void {
    this.router.navigate(['/viewer'], { skipLocationChange: true });
  }

}

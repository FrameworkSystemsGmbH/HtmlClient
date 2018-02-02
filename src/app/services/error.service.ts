import { ErrorHandler, Injectable, Injector, ChangeDetectorRef, NgZone } from '@angular/core';

import { ErrorBoxService } from 'app/services/overlays/errorbox.service';

@Injectable()
export class ErrorService extends ErrorHandler {

  private zone: NgZone;
  private errorBoxService: ErrorBoxService;

  constructor(private injector: Injector) {
    super();
  }

  public handleError(error: any): void {
    if (!this.zone) {
      this.zone = this.injector.get(NgZone);
    }

    if (!this.errorBoxService) {
      this.errorBoxService = this.injector.get(ErrorBoxService);
    }

    this.zone.run(() => {
      this.errorBoxService.openErrorBox({
        errorMessage: {
          message: error && error.message ? error.message : 'An unknown error occured!',
          stackTrace: error ? JSON.stringify(error, null, 2) : null
        }
      });
    });

    super.handleError(error);
  }
}

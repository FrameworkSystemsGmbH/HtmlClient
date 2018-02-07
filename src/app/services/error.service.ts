import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { ErrorBoxOverlay } from 'app/components/errorbox/errorbox-overlay';

@Injectable()
export class ErrorService extends ErrorHandler {

  private zone: NgZone;
  private errorBoxOverlay: ErrorBoxOverlay;

  constructor(private injector: Injector) {
    super();
  }

  public handleError(error: any): void {
    if (!this.zone) {
      this.zone = this.injector.get(NgZone);
    }

    if (!this.errorBoxOverlay) {
      this.errorBoxOverlay = this.injector.get(ErrorBoxOverlay);
    }

    this.zone.run(() => {
      this.errorBoxOverlay.openErrorBox({
        errorMessage: {
          message: error && error.message ? error.message : 'An unknown error occured!',
          stackTrace: error ? JSON.stringify(error, null, 2) : null
        }
      });
    });

    super.handleError(error);
  }
}

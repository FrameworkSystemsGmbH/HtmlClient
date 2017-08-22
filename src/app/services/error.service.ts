import { ErrorHandler } from '@angular/core';

export class ErrorService implements ErrorHandler {

  public handleError(error: any): void {
    // Modal dialog here!
    throw error;
  }
}

import { Injectable, ErrorHandler } from '@angular/core';

@Injectable()
export class ErrorService implements ErrorHandler {

  public handleError(error: any): void {
    // Modal dialog here!
    throw error;
  }
}

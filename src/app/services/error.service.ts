import { Injectable, EventEmitter } from '@angular/core';

import { LogService } from '.';

@Injectable()
export class ErrorService {

  public readonly errorThrown: EventEmitter<Error> = new EventEmitter<Error>();

  constructor(private logService: LogService) { }

  public processError(error: Error) {
    this.logService.writeError(error)
    this.errorThrown.emit(error);
  }
}

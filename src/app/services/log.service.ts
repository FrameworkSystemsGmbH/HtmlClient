import { Injectable } from '@angular/core';

@Injectable()
export class LogService {

  public write(text: string): void {
    if (text) {
      console.log(text);
    }
  }

  public writeLine(text: string): void {
    if (text) {
      console.log(text + '\n');
    }
  }

  public writeError(error: Error): void {
    if (error) {
      console.error(
        'An error of type\'' + error.name + '\' occured!\n' +
        'Message: ' + error.message + '\n' +
        'Stacktrace: ' + error.stack + '\n');
    }
  }

}

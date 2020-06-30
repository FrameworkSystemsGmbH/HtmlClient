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
}

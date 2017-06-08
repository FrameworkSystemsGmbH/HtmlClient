import { Injectable, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';

import { ErrorService } from './error.service';
import { LogService } from './log.service';


@Injectable()
export class HttpService {

  public static readonly BROKERURL: string = 'http://localhost:4200/static/response.json';

  public readonly onResponseReceived: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private http: Http,
    private errorService: ErrorService,
    private logService: LogService) { }

  public doRequest(requestJson: any): void {
    try {
      this.http.get(HttpService.BROKERURL)
        .map(response => response.json())
        .subscribe(responseJson => {
          this.onResponseReceived.emit(responseJson);
        });
    } catch (error) {
      this.errorService.processError(error);
    }
  }
}

import {
  Injectable,
  EventEmitter
} from '@angular/core';

import { Http } from '@angular/http';

import { ErrorService } from './error.service';
import { LogService } from './log.service';

@Injectable()
export class HttpService {

  public static readonly BROKERURL: string = 'http://nv286:4000/';

  public readonly onResponseReceived: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private http: Http,
    private errorService: ErrorService,
    private logService: LogService) { }

  public doRequest(requestJson: any): void {
    try {
      this.http.post(HttpService.BROKERURL + 'api/process', requestJson)
        .map(response => response.json())
        .subscribe(responseJson => {
          this.onResponseReceived.emit(responseJson);
        });
    } catch (error) {
      this.errorService.processError(error);
    }
  }
}

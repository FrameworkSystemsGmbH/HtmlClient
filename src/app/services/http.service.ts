import { Injectable, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HttpService {

  private brokerUrl: string;

  constructor(
    private http: Http) { }

  public setBrokerUrl(brokerUrl: string): void {
    this.brokerUrl = brokerUrl;
  }

  public doRequest(requestJson: any): Observable<any> {
    console.log(JSON.stringify(requestJson, null, 2));
    return this.http.post(this.brokerUrl, requestJson)
      .map(response => response.json());
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HttpService {

  private brokerUrl: string;

  constructor(private httpClient: HttpClient) { }

  public setBrokerUrl(brokerUrl: string): void {
    this.brokerUrl = brokerUrl;
  }

  public doRequest(requestJson: any): Observable<any> {
    // console.log(JSON.stringify(requestJson, null, 2));
    return this.httpClient.post(this.brokerUrl, requestJson);
      // .do(response => {
      //   console.log(JSON.stringify(response, null, 2));
      // });
  }
}

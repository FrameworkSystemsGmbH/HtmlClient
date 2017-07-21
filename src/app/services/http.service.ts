import { Injectable, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';


@Injectable()
export class HttpService {

  public static readonly BROKERURL: string = 'http://localhost:4200/static/response.json';

  public readonly onResponseReceived: EventEmitter<any> = new EventEmitter<any>();

  private brokerUrl: string;

  constructor(
    private http: Http) { }

  public setBrokerUrl(brokerUrl: string): void {
    this.brokerUrl = brokerUrl;
  }

  public doRequest(requestJson: any): void {
    this.http.post(this.brokerUrl, requestJson)
      .map(response => response.json())
      .subscribe(responseJson => {
        this.onResponseReceived.emit(responseJson);
      });
  }
}

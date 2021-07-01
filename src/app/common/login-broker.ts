export class LoginBroker {

  public _name: string;
  public _url: string;

  public constructor(name: string, url: string) {
    this._name = name;
    this._url = url;
  }

  public get name(): string {
    return this._name;
  }

  public get url(): string {
    return this._url;
  }

  public set url(value: string) {
    this._url = value;
  }
}

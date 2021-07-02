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

  public static getFromJson(json: any): LoginBroker | null {
    if (!json || !json.name || !json.url) {
      return null;
    }

    return new LoginBroker(json.name, json.url);
  }

  public getJson(): any {
    return {
      name: this._name,
      url: this._url
    };
  }
}

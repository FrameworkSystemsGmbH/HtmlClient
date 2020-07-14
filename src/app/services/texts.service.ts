import { Injectable } from '@angular/core';

@Injectable()
export class TextsService {

  public static RETRY: number = 1;
  public static CLOSE: number = 2;
  public static CANCEL: number = 3;
  public static IGNORE: number = 7;
  public static YES: number = 8;
  public static NO: number = 9;
  public static OK: number = 17;
  public static DELETE: number = 21;

  private texts: Map<number, string> = new Map<number, string>();

  public getText(id: number): string {
    return this.texts.get(id);
  }

  public setText(id: number, value: string): void {
    this.texts.set(id, value);
  }

  public getState(): Array<any> {
    const json: Array<any> = new Array<any>();

    this.texts.forEach((value, key) => {
      json.push({
        id: key,
        text: value
      });
    });

    return json;
  }

  public setState(json: Array<any>): void {
    if (!json || !json.length) {
      return;
    }

    const texts: Map<number, string> = new Map<number, string>();

    json.forEach(entry => {
      texts.set(entry.id, entry.text);
    });

    this.texts = texts;
  }
}

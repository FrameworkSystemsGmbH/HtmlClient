import { Injectable } from '@angular/core';

/** Wird nicht verwendet...
 * Map von allen TextCollections. Im ersten Response kommen die ganzen Texte mit Übersetzungen/Sprachen an.
 * Das steht hier im Service. */
@Injectable({ providedIn: 'root' })
export class TextsService {

  public static RETRY: number = 1;
  public static CLOSE: number = 2;
  public static CANCEL: number = 3;
  public static IGNORE: number = 7;
  public static YES: number = 8;
  public static NO: number = 9;
  public static OK: number = 17;
  public static DELETE: number = 21;

  private _texts: Map<number, string> = new Map<number, string>();

  public getText(id: number): string | undefined {
    return this._texts.get(id);
  }

  public setText(id: number, value: string): void {
    this._texts.set(id, value);
  }

  public saveState(): Array<any> {
    const json: Array<any> = new Array<any>();

    this._texts.forEach((value, key) => {
      json.push({
        id: key,
        text: value
      });
    });

    return json;
  }

  public loadState(json: Array<any> | null): void {
    if (json == null || json.length === 0) {
      return;
    }

    const texts: Map<number, string> = new Map<number, string>();

    json.forEach(entry => {
      texts.set(entry.id, entry.text);
    });

    this._texts = texts;
  }
}

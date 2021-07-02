import { Injectable } from '@angular/core';
import { PropertyData } from '@app/common/property-data';

@Injectable({ providedIn: 'root' })
export class ControlStyleService {

  private _controlStyles: Map<string, PropertyData> = new Map<string, PropertyData>();

  public addControlStyle(key: string, data: PropertyData): void {
    this._controlStyles.set(key, data);
  }

  public getControlStyle(key: string): PropertyData | null {
    const data: PropertyData | undefined = this._controlStyles.get(key);
    return data != null ? data : null;
  }

  public getBaseControlStyle(): PropertyData | null {
    const data: PropertyData | undefined = this._controlStyles.get('BaseControl');
    return data != null ? data : null;
  }

  public saveState(): Array<any> {
    const json: Array<any> = new Array<any>();

    this._controlStyles.forEach((value, key) => {
      json.push({
        name: key,
        style: value
      });
    });

    return json;
  }

  public loadState(json: Array<any> | null): void {
    if (!json || json.length === 0) {
      return;
    }

    const styles: Map<string, PropertyData> = new Map<string, PropertyData>();

    json.forEach(entry => {
      styles.set(entry.name, entry.style);
    });

    this._controlStyles = styles;
  }
}

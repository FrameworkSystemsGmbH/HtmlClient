import { PropertyData } from 'app/common/property-data';

export class ControlStyleService {

  private controlStyles: Map<string, PropertyData> = new Map<string, PropertyData>();

  public addControlStyle(key: string, data: PropertyData): void {
    this.controlStyles.set(key, data);
  }

  public getControlStyle(key: string): PropertyData {
    return this.controlStyles.get(key);
  }

  public getBaseControlStyle(): PropertyData {
    return this.controlStyles.get('BaseControl');
  }

  public getState(): Array<any> {
    const json: Array<any> = new Array<any>();

    this.controlStyles.forEach((value, key) => {
      json.push({
        name: key,
        style: value
      });
    });

    return json;
  }

  public setState(json: Array<any>): void {
    if (!json || !json.length) {
      return;
    }

    const styles: Map<string, PropertyData> = new Map<string, PropertyData>();

    json.forEach(entry => {
      styles.set(entry.name, entry.style);
    });

    this.controlStyles = styles;
  }
}

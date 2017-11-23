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
}

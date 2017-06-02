import { Injectable } from '@angular/core';
import { PropertyData } from '../common';

@Injectable()
export class ControlStyleService {

  private controlStyles: Map<string, PropertyData> = new Map<string, PropertyData>();

  public addControlStyle(key: string, data: PropertyData): void {
    this.controlStyles.set(key, data);
  }

  public getControlStyle(key: string): PropertyData {
    return this.controlStyles.get(key);
  }

}

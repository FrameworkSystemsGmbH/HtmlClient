import { LayoutablePropertiesDefault } from './layoutable-properties-default';
import { BaseWrapper } from '../wrappers/base-wrapper';

export class LayoutablePropertiesScrollable extends LayoutablePropertiesDefault {

  private hBarNeeded: boolean;
  private vBarNeeded: boolean;

  constructor(wrapper: BaseWrapper) {
    super(wrapper);
  }

  public getHBarNeeded(): boolean {
    return this.hBarNeeded;
  }

  public setHBarNeeded(needed: boolean): void {
    this.hBarNeeded = needed;
  }

  public getVBarNeeded(): boolean {
    return this.vBarNeeded;
  }

  public setVBarNeeded(needed: boolean): void {
    this.vBarNeeded = needed;
  }
}

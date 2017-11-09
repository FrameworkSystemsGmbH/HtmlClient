import { LayoutablePropertiesDefault } from './layoutable-properties-default';
import { BaseWrapper } from 'app/wrappers/base-wrapper';

export class LayoutablePropertiesScrollable extends LayoutablePropertiesDefault {

  private hBarNeeded: boolean;

  constructor(wrapper: BaseWrapper) {
    super(wrapper);
  }

  public getHBarNeeded(): boolean {
    return this.hBarNeeded;
  }

  public setHBarNeeded(needed: boolean): void {
    this.hBarNeeded = needed;
  }
}

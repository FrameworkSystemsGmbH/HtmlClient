import { LayoutablePropertiesDefault } from './layoutable-properties-default';
import { LayoutableWrapper } from 'app/wrappers/layoutable-wrapper';

export class LayoutablePropertiesScrollable extends LayoutablePropertiesDefault {

  private hBarNeeded: boolean;

  constructor(wrapper: LayoutableWrapper) {
    super(wrapper);
  }

  public getHBarNeeded(): boolean {
    return this.hBarNeeded;
  }

  public setHBarNeeded(needed: boolean): void {
    this.hBarNeeded = needed;
  }
}

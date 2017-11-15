import { ILayoutableWrapper } from 'app/wrappers/layout/layoutable-wrapper.interface';

import { LayoutablePropertiesDefault } from 'app/wrappers/layout/layoutable-properties-default';

export class LayoutablePropertiesScrollable extends LayoutablePropertiesDefault {

  private hBarNeeded: boolean;

  constructor(wrapper: ILayoutableWrapper) {
    super(wrapper);
  }

  public getHBarNeeded(): boolean {
    return this.hBarNeeded;
  }

  public setHBarNeeded(needed: boolean): void {
    this.hBarNeeded = needed;
  }
}

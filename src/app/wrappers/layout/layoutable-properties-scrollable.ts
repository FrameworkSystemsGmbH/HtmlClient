import { ILayoutableControlWrapper } from 'app/wrappers/layout/layoutable-control-wrapper.interface';

import { LayoutablePropertiesDefault } from 'app/wrappers/layout/layoutable-properties-default';

export class LayoutablePropertiesScrollable extends LayoutablePropertiesDefault {

  private hBarNeeded: boolean;

  constructor(wrapper: ILayoutableControlWrapper) {
    super(wrapper);
  }

  public getHBarNeeded(): boolean {
    return this.hBarNeeded;
  }

  public setHBarNeeded(needed: boolean): void {
    this.hBarNeeded = needed;
  }
}

import { ViewContainerRef, ComponentRef } from '@angular/core';

import { BaseWrapper } from '.';
import { LayoutControlLabel } from '../layout';
import { LabelComponent } from '../controls';

export class ControlLabelWrapper extends BaseWrapper implements LayoutControlLabel {

  public todo(): void {

  }

  public createComponent(): ComponentRef<LabelComponent> {
    return null;
  }

  public updateComponent(): void {

  }

}

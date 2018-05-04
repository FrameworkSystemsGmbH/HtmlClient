import { Injector } from '@angular/core';

import { ControlLabelContainerBaseWrapper } from 'app/wrappers/control-labels/control-label-container-base-wrapper';
import { ControlLabelWrapper } from 'app/wrappers/control-labels/control-label-wrapper';
import { ControlLabelTemplate } from 'app/wrappers/control-labels/control-label-template';

export class ControlLabelContainerSingleWrapper extends ControlLabelContainerBaseWrapper {

  constructor(
    injector: Injector,
    labelWrapper: ControlLabelWrapper,
    rowLabelTemplate: ControlLabelTemplate
  ) {
    const labelWrappers: Array<ControlLabelWrapper> = new Array<ControlLabelWrapper>();
    labelWrappers.push(labelWrapper);
    super(injector, labelWrappers, rowLabelTemplate);
  }

  protected createName(): string {
    let name: string = String.empty();

    for (const labelWrapper of this.getLabelWrappers()) {
      name += labelWrapper.getName() + '_';
    }

    name += '_ControlLabelSingleContainer';

    return name;
  }
}

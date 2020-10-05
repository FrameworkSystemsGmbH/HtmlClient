import { Injector } from '@angular/core';
import { ControlLabelContainerBaseWrapper } from '@app/wrappers/control-labels/control-label-container-base-wrapper';
import { ControlLabelTemplate } from '@app/wrappers/control-labels/control-label-template';
import { ControlLabelWrapper } from '@app/wrappers/control-labels/control-label-wrapper';
import { FieldRowWrapper } from '@app/wrappers/field-row-wrapper';

export interface IControlLabelContainerSingleWrapperOptions {
  labelWrapper: ControlLabelWrapper;
  fieldRowWrp: FieldRowWrapper;
  rowLabelTemplate: ControlLabelTemplate;
}

export class ControlLabelContainerSingleWrapper extends ControlLabelContainerBaseWrapper {

  constructor(injector: Injector, options: IControlLabelContainerSingleWrapperOptions) {
    const labelWrappers: Array<ControlLabelWrapper> = new Array<ControlLabelWrapper>();
    labelWrappers.push(options.labelWrapper);
    super(injector, { labelWrappers, fieldRowWrp: options.fieldRowWrp, rowLabelTemplate: options.rowLabelTemplate });
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

import { Injector } from '@angular/core';

import { ControlLabelContainerBaseWrapper } from 'app/wrappers/control-labels/control-label-container-base-wrapper';
import { ControlLabelWrapper } from 'app/wrappers/control-labels/control-label-wrapper';
import { ControlLabelSeparatorWrapper } from 'app/wrappers/control-labels/control-label-separator-wrapper';
import { ControlLabelSeparatorProvider } from 'app/wrappers/control-labels/control-label-separator-provider';
import { ControlLabelTemplate } from 'app/wrappers/control-labels/control-label-template';
import { FieldRowWrapper } from 'app/wrappers/field-row-wrapper';
import { Visibility } from 'app/enums/visibility';

export class ControlLabelContainerMergedWrapper extends ControlLabelContainerBaseWrapper {

  private injector: Injector;

  constructor(
    injector: Injector,
    labelWrappers: Array<ControlLabelWrapper>,
    fieldRowWrp: FieldRowWrapper,
    rowLabelTemplate: ControlLabelTemplate
  ) {
    super(injector, labelWrappers, fieldRowWrp, rowLabelTemplate);
    this.injector = injector;
    this.initLabels();
  }

  protected createName(): string {
    let name: string = String.empty();

    for (const labelWrapper of this.getLabelWrappers()) {
      name += labelWrapper.getName() + '_';
    }

    name += '_ControlLabelMergedContainer';

    return name;
  }

  private initLabels(): void {
    const labelWrappers: Array<ControlLabelWrapper> = this.getLabelWrappers();
    const labelsWithSeparators: Array<ControlLabelWrapper> = new Array<ControlLabelWrapper>();

    for (let i = 0; i < labelWrappers.length; i++) {
      if (i > 0) {
        labelsWithSeparators.push(new ControlLabelSeparatorWrapper(this.injector, new ControlLabelSeparatorProvider(this.getRowLabelTemplate())));
      }
      labelsWithSeparators.push(labelWrappers[i]);
    }

    this.setLabelWrappers(labelsWithSeparators);
  }

  public onWrapperVisibilityChanged(): void {
    super.onWrapperVisibilityChanged();

    const fieldRowWrp: FieldRowWrapper = this.getFieldRowWrapper();
    const fieldRowWrpVis: Visibility = fieldRowWrp.getCurrentVisibility();

    if (fieldRowWrpVis !== Visibility.Visible) {
      this.setAllSeperatorsVisibility(fieldRowWrpVis);
    } else {
      this.setAllSeperatorsVisibility(Visibility.Visible);
      this.hideUnusedSeparators();
    }
  }

  protected setAllSeperatorsVisibility(visibility: Visibility): void {
    const labelWrappers: Array<ControlLabelWrapper> = this.getLabelWrappers();

    labelWrappers.forEach(labelWrapper => {
      if (labelWrapper instanceof ControlLabelSeparatorWrapper) {
        const separatorWrp: ControlLabelSeparatorWrapper = labelWrapper as ControlLabelSeparatorWrapper;
        separatorWrp.setVisibility(visibility);
      }
    });
  }

  protected hideUnusedSeparators(): void {

  }
}

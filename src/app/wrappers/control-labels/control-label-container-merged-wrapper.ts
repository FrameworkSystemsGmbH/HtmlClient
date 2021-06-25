import { Injector } from '@angular/core';
import { Visibility } from '@app/enums/visibility';
import { ControlLabelContainerMergedLayout } from '@app/layout/control-label-container-layout/control-label-container-merged-layout';
import { LayoutContainerBase } from '@app/layout/layout-container-base';
import { ControlLabelContainerBaseWrapper, IControlLabelContainerBaseWrapperOptions } from '@app/wrappers/control-labels/control-label-container-base-wrapper';
import { ControlLabelSeparatorProvider } from '@app/wrappers/control-labels/control-label-separator-provider';
import { ControlLabelSeparatorWrapper } from '@app/wrappers/control-labels/control-label-separator-wrapper';
import { ControlLabelWrapper } from '@app/wrappers/control-labels/control-label-wrapper';
import { FieldRowWrapper } from '@app/wrappers/field-row-wrapper';

export class ControlLabelContainerMergedWrapper extends ControlLabelContainerBaseWrapper {

  private readonly _injector: Injector;

  public constructor(injector: Injector, options: IControlLabelContainerBaseWrapperOptions) {
    super(injector, options);
    this._injector = injector;
    this.initLabels();
  }

  protected createLayout(): LayoutContainerBase {
    return new ControlLabelContainerMergedLayout(this);
  }

  protected createName(): string {
    let name: string = String.empty();

    for (const labelWrapper of this.getLabelWrappers()) {
      name += `${labelWrapper.getName()}_`;
    }

    name += '_ControlLabelMergedContainer';

    return name;
  }

  private initLabels(): void {
    const labelWrappers: Array<ControlLabelWrapper> = this.getLabelWrappers();
    const labelsWithSeparators: Array<ControlLabelWrapper> = new Array<ControlLabelWrapper>();

    for (let i = 0; i < labelWrappers.length; i++) {
      if (i > 0) {
        labelsWithSeparators.push(new ControlLabelSeparatorWrapper(this._injector, new ControlLabelSeparatorProvider(this.getRowLabelTemplate()), this.getFieldRowWrapper()));
      }
      labelsWithSeparators.push(labelWrappers[i]);
    }

    this.setLabelWrappers(labelsWithSeparators);
    this.adjustSeparators();
  }

  public onWrapperVisibilityChanged(): void {
    super.onWrapperVisibilityChanged();

    const fieldRowWrp: FieldRowWrapper = this.getFieldRowWrapper();
    const fieldRowWrpVis: Visibility = fieldRowWrp.getCurrentVisibility();

    if (fieldRowWrpVis !== Visibility.Visible) {
      this.setAllSeperatorsVisibility(fieldRowWrpVis);
    } else {
      this.setAllSeperatorsVisibility(Visibility.Visible);
      this.adjustSeparators();
    }
  }

  protected setAllSeperatorsVisibility(visibility: Visibility): void {
    const labelWrappers: Array<ControlLabelWrapper> = this.getLabelWrappers();

    labelWrappers.forEach(labelWrapper => {
      if (labelWrapper instanceof ControlLabelSeparatorWrapper) {
        const separatorWrp: ControlLabelSeparatorWrapper = labelWrapper;
        separatorWrp.setVisibility(visibility);
      }
    });
  }

  protected adjustSeparators(): void {
    const visibleWrappers: Array<ControlLabelWrapper> = this.getLabelWrappers().filter(labelWrp => labelWrp.getCurrentVisibility() === Visibility.Visible);

    // Trim separators from start
    for (const visibleWrp of visibleWrappers) {
      if (visibleWrp instanceof ControlLabelSeparatorWrapper) {
        const separatorWrp: ControlLabelSeparatorWrapper = visibleWrp;
        separatorWrp.setVisibility(Visibility.Collapsed);
      } else {
        break;
      }
    }

    // Trim separators from end
    for (let i = visibleWrappers.length - 1; i >= 0; i--) {
      const visibleWrp: ControlLabelWrapper = visibleWrappers[i];
      if (visibleWrp instanceof ControlLabelSeparatorWrapper) {
        const separatorWrp: ControlLabelSeparatorWrapper = visibleWrp;
        separatorWrp.setVisibility(Visibility.Collapsed);
      } else {
        break;
      }
    }

    // Limit separator count between labels to one
    let separatorFound: boolean = false;
    for (const visibleWrp of visibleWrappers) {
      if (visibleWrp instanceof ControlLabelSeparatorWrapper) {
        if (separatorFound) {
          const separatorWrp: ControlLabelSeparatorWrapper = visibleWrp;
          separatorWrp.setVisibility(Visibility.Collapsed);
        } else {
          separatorFound = true;
        }
      } else {
        separatorFound = false;
      }
    }
  }
}

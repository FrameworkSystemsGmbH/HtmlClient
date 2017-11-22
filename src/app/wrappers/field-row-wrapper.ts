import { ViewContainerRef, ComponentRef } from '@angular/core';

import { ILayoutableControlWrapper } from 'app/wrappers/layout/layoutable-control-wrapper.interface';
import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';
import { IFieldContainer } from 'app/layout/field-layout/field-container.interface';
import { IFieldRowControl } from 'app/layout/field-layout/field-row-control.interface';

import { ControlComponent } from 'app/controls/control.component';
import { ControlWrapper } from 'app/wrappers/control-wrapper';
import { ContainerWrapper } from 'app/wrappers/container-wrapper';
import { FieldPanelWrapper } from 'app/wrappers/field-panel-wrapper';
import { FieldRowLabelMode } from 'app/layout/field-layout/field-row-label-mode';
import { ControlLabelWrapper } from 'app/wrappers/control-labels/control-label-wrapper';

export class FieldRowWrapper extends ContainerWrapper implements IFieldRowControl {

  private hasFirstColumnControl: boolean;

  public getFieldRowSize(): number {
    const fieldRowSize: number = this.getPropertyStore().getFieldRowSize();
    return fieldRowSize != null ? fieldRowSize : null;
  }

  public getFieldRowLabelMode(): FieldRowLabelMode {
    const labelMode: FieldRowLabelMode = this.getPropertyStore().getLabelMode();
    return labelMode != null ? labelMode : FieldRowLabelMode.Generated;
  }

  public getOptimizeGeneratedLabels(): boolean {
    return Boolean.falseIfNull(this.getPropertyStore().getOptimizeGeneratedLabels());
  }

  protected createControlLabelWrapper(): ILayoutableControlWrapper {
    const wrappers: Array<ControlWrapper> = this.controls;
    const labelWrappers: Array<ControlLabelWrapper> = new Array<ControlLabelWrapper>();

    for (const wrapper of wrappers) {
      if (wrapper.providesControlLabelWrapper()) {
        const labelWrapper: ControlLabelWrapper = wrapper.getControlLabelWrapper() as ControlLabelWrapper;
        if (labelWrapper) {
          labelWrappers.push(labelWrapper);
        }
      }
    }

    if (labelWrappers && labelWrappers.length) {
      return this.getControlsService().createControlLabelMergedWrapper(labelWrappers, this.getParent().getRowLabelTemplate(), this.getOptimizeGeneratedLabels());
    } else {
      return null;
    }
  }

  public getHasFirstColumnControl(): boolean {
    return this.hasFirstColumnControl;
  }

  public getParent(): FieldPanelWrapper {
    return super.getParent() as FieldPanelWrapper;
  }

  public getFieldContainer(): IFieldContainer {
    return this.getParent() as IFieldContainer;
  }

  public getViewContainerRef(): ViewContainerRef {
    throw new Error('FieldRowWrapper never gets rendered to the UI! This method should not be called!');
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<ControlComponent> {
    throw new Error('FieldRowWrapper never gets rendered to the UI! This method should not be called!');
  }

  public attachComponent(uiContainer: ILayoutableContainerWrapper, vchContainer: ILayoutableContainerWrapper): void {
    // The FieldRow only attaches itself to the VCH since it does not render a UI Component
    vchContainer.getVchContainer().addChild(this);

    // 1. All UI Components of the children get directly attached to the FieldPanel
    // 2. All child wrappers get attached to the FieldRow in the VCH
    this.attachSubComponents(uiContainer, this);
  }

  protected attachSubComponents(uiContainer: ILayoutableContainerWrapper, vchContainer: ILayoutableContainerWrapper): void {
    const labelMode: FieldRowLabelMode = this.getFieldRowLabelMode();
    const wrappers: Array<ControlWrapper> = this.controls;

    // Reset first column indicator
    this.hasFirstColumnControl = false;

    // Create the merged label and attach it if necessary
    if (labelMode === FieldRowLabelMode.GeneratedMerged) {
      const mergedLabel: ILayoutableControlWrapper = this.getControlLabelWrapper();
      if (mergedLabel) {
        this.hasFirstColumnControl = true;
        mergedLabel.attachComponent(uiContainer, vchContainer);
      }
    }

    // Create labels and add wrappers depending on LabelMode
    for (let i = 0; i < wrappers.length; i++) {
      const wrapper: ControlWrapper = wrappers[i];
      if (labelMode === FieldRowLabelMode.Generated && wrapper.providesControlLabelWrapper()) {
        const controlLabelWrapper: ILayoutableControlWrapper = wrapper.getControlLabelWrapper();
        if (controlLabelWrapper) {
          if (i === 0) {
            this.hasFirstColumnControl = true;
          }
          controlLabelWrapper.attachComponent(uiContainer, vchContainer);
        }
      }

      if (labelMode === FieldRowLabelMode.NoneAligned) {
        this.hasFirstColumnControl = true;
      }

      wrapper.attachComponent(uiContainer, vchContainer);
    }
  }
}

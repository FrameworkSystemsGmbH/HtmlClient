import { ComponentRef, ViewContainerRef } from '@angular/core';
import { ControlComponent } from '@app/controls/control.component';
import { ControlType } from '@app/enums/control-type';
import { IFieldContainer } from '@app/layout/field-layout/field-container.interface';
import { IFieldRowControl } from '@app/layout/field-layout/field-row-control.interface';
import { FieldRowLabelMode } from '@app/layout/field-layout/field-row-label-mode';
import { ContainerWrapper } from '@app/wrappers/container-wrapper';
import { ControlLabelContainerMergedWrapper } from '@app/wrappers/control-labels/control-label-container-merged-wrapper';
import { ControlLabelContainerSingleWrapper } from '@app/wrappers/control-labels/control-label-container-single-wrapper';
import { ControlLabelWrapper } from '@app/wrappers/control-labels/control-label-wrapper';
import { IControlLabelWrapper } from '@app/wrappers/control-labels/control-label-wrapper.interface';
import { ControlWrapper } from '@app/wrappers/control-wrapper';
import { FieldPanelWrapper } from '@app/wrappers/field-panel-wrapper';
import { ILayoutableContainerWrapper } from '@app/wrappers/layout/layoutable-container-wrapper.interface';
import { ILayoutableControlWrapper } from '@app/wrappers/layout/layoutable-control-wrapper.interface';
import * as LabelUtil from '@app/util/label-util';

export class FieldRowWrapper extends ContainerWrapper implements IFieldRowControl {

  private _hasFirstColumnControl: boolean = false;
  private _labelsToOptimize: Array<ControlLabelWrapper> | null = null;

  public getControlType(): ControlType {
    return ControlType.FieldRow;
  }

  public getFieldRowSize(): number | null {
    const fieldRowSize: number | undefined = this.getPropertyStore().getFieldRowSize();
    return fieldRowSize ?? null;
  }

  public getFieldRowLabelMode(): FieldRowLabelMode {
    const labelMode: FieldRowLabelMode | undefined = this.getPropertyStore().getLabelMode();
    return labelMode ?? FieldRowLabelMode.Generated;
  }

  public getOptimizeGeneratedLabels(): boolean {
    return Boolean.falseIfNull(this.getPropertyStore().getOptimizeGeneratedLabels());
  }

  public optimizeLabels(): void {
    if (this._labelsToOptimize != null && this._labelsToOptimize.length > 0) {
      LabelUtil.optimizeLabels(this._labelsToOptimize);
    }
  }

  protected createControlLabelWrapper(): IControlLabelWrapper | null {
    const wrappers: Array<ControlWrapper> = this.controls;

    if (wrappers.length === 0) {
      return null;
    }

    const labelMode: FieldRowLabelMode = this.getFieldRowLabelMode();

    if (labelMode === FieldRowLabelMode.Generated) {
      const firstWrapper: ControlWrapper = wrappers[0];
      if (firstWrapper.providesControlLabelWrapper()) {
        const controlLabelWrapper: ControlLabelWrapper | null = wrappers[0].getControlLabelWrapper(this) as ControlLabelWrapper | null;
        if (controlLabelWrapper) {
          return new ControlLabelContainerSingleWrapper(this.getInjector(), { labelWrapper: controlLabelWrapper, fieldRowWrp: this, rowLabelTemplate: this.getParent().getRowLabelTemplate() });
        }
      }
    } else if (labelMode === FieldRowLabelMode.GeneratedMerged) {
      const labelWrappers: Array<ControlLabelWrapper> = new Array<ControlLabelWrapper>();

      for (const wrapper of wrappers) {
        if (wrapper.providesControlLabelWrapper()) {
          const labelWrapper: ControlLabelWrapper | null = wrapper.getControlLabelWrapper(this) as ControlLabelWrapper | null;
          if (labelWrapper) {
            labelWrappers.push(labelWrapper);
          }
        }
      }

      if (labelWrappers.length > 0) {
        if (this.getOptimizeGeneratedLabels()) {
          this._labelsToOptimize = labelWrappers;
        }
        return new ControlLabelContainerMergedWrapper(this.getInjector(), { labelWrappers, fieldRowWrp: this, rowLabelTemplate: this.getParent().getRowLabelTemplate() });
      }
    }

    return null;
  }

  public getHasFirstColumnControl(): boolean {
    return this._hasFirstColumnControl;
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

    /*
     * 1. All UI Components of the children get directly attached to the FieldPanel
     * 2. All child wrappers get attached to the FieldRow in the VCH
     */
    this.attachSubComponents(uiContainer, this);
  }

  protected attachSubComponents(uiContainer: ILayoutableContainerWrapper, vchContainer: ILayoutableContainerWrapper): void {
    const labelMode: FieldRowLabelMode = this.getFieldRowLabelMode();
    const wrappers: Array<ControlWrapper> = this.controls;
    const labelsToOptimize: Array<ControlLabelWrapper> = new Array<ControlLabelWrapper>();

    // Reset first column indicator
    this._hasFirstColumnControl = false;

    /*
     * Create the label for the first column and attach it if necessary
     * This is either the label of the first control or the merged label for all controls in the row
     */
    if (labelMode === FieldRowLabelMode.Generated || labelMode === FieldRowLabelMode.GeneratedMerged) {
      const firstColumnLabel: ILayoutableControlWrapper | null = this.getControlLabelWrapper(this);
      if (firstColumnLabel) {
        this._hasFirstColumnControl = true;
        firstColumnLabel.attachComponent(uiContainer, vchContainer);
      }
    }

    // Create labels and add wrappers depending on LabelMode
    for (let i = 0; i < wrappers.length; i++) {
      const wrapper: ControlWrapper = wrappers[i];
      if (labelMode === FieldRowLabelMode.Generated && wrapper.providesControlLabelWrapper()) {
        const controlLabelWrapper: ControlLabelWrapper | null = wrapper.getControlLabelWrapper(this) as ControlLabelWrapper | null;
        if (controlLabelWrapper) {
          if (this.getOptimizeGeneratedLabels()) {
            labelsToOptimize.push(controlLabelWrapper);
          }

          // The ControlLabel for the first column has already been attached above
          if (i > 0) {
            controlLabelWrapper.attachComponent(uiContainer, vchContainer);
          }
        }
      }

      if (labelMode === FieldRowLabelMode.NoneAligned) {
        this._hasFirstColumnControl = true;
      }

      wrapper.attachComponent(uiContainer, vchContainer);
    }

    if (labelsToOptimize.length > 0) {
      this._labelsToOptimize = labelsToOptimize;
    }

    this.optimizeLabels();
  }
}
